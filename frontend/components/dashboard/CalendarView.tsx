'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Calendar, MapPin, Clock, Users, Trash2, Plus, X, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { useTheme } from '@/components/dashboard/Header'
import { toast } from 'sonner'

dayjs.extend(utc)
dayjs.extend(timezone)

const Colors = { cyan: '#13F287', purple: '#6200D9', magenta: '#DB66FF', red: '#FF2D78' }

interface CalendarEvent {
  id: number
  title: string
  start: string
  end: string
  location: string
  attendees: number
  type: 'interview' | 'deadline' | 'meeting'
  description: string
  date?: string
  color?: string
}

interface Holiday {
  id: string
  title: string
  date: string
  type: string
  emoji: string
  description: string
  color?: string
}

export default function CalendarView() {
  const { theme } = useTheme()
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [viewMode, setViewMode] = useState('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showNewEventForm, setShowNewEventForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    attendees: 0,
    type: 'interview' as const,
    description: '',
  })

  const cardBgClass =
    theme === 'neon'
      ? 'bg-[#0A0F18] border-[#13F287]/30 shadow-[0_0_20px_rgba(19,242,135,0.05)]'
      : 'bg-[#121826] border-white/5'

  // 🔄 FETCH CALENDAR DATA FROM API
  const fetchCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      const month = currentDate.month()
      const year = currentDate.year()

      const response = await fetch(
        `/api/calendar?month=${month}&year=${year}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch calendar')

      const data = await response.json()

      // Process API response
      setHolidays(data.holidays || [])
      setEvents(data.events || [])
    } catch (error: any) {
      console.error('Error fetching calendar:', error)
      toast.error('Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }, [currentDate])

  // Fetch data when month/year changes
  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

  // 📝 ADD NEW EVENT
  const addEvent = useCallback(async () => {
    if (!newEvent.title || !selectedDate) {
      toast.error('Please enter an event title and select a date')
      return
    }

    try {
      const startDate = selectedDate.hour(10).minute(0).toDate()
      const endDate = selectedDate.hour(11).minute(0).toDate()

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          location: newEvent.location,
          attendees: newEvent.attendees,
          type: newEvent.type,
          description: newEvent.description,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Failed to create event')

      const data = await response.json()

      // Add new event to state
      const createdEvent: CalendarEvent = {
        id: data.event.id,
        title: data.event.title,
        start: data.event.start,
        end: data.event.end,
        location: data.event.location,
        attendees: data.event.attendees,
        type: data.event.type,
        description: data.event.description,
        color: data.event.type === 'interview' ? Colors.cyan : data.event.type === 'deadline' ? Colors.red : Colors.purple
      }

      setEvents([...events, createdEvent])
      setNewEvent({ title: '', location: '', attendees: 0, type: 'interview', description: '' })
      setShowNewEventForm(false)
      setSelectedDate(null)
      toast.success('✅ Event created successfully!')
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
    }
  }, [events, newEvent, selectedDate])

  // 🗑️ DELETE EVENT
  const deleteEvent = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/calendar?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to delete event')

      setEvents(events.filter((e) => e.id !== id))
      setShowEventModal(false)
      toast.success('✅ Event deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }, [events])

  // 📅 GET CALENDAR DAYS
  const getDaysInMonth = useCallback(() => {
    const year = currentDate.year()
    const month = currentDate.month()
    const firstDay = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`)
    const lastDay = firstDay.endOf('month')
    const daysArray = []

    for (let i = firstDay.day(); i > 0; i--) daysArray.push(firstDay.subtract(i, 'day'))
    for (let i = 1; i <= lastDay.date(); i++)
      daysArray.push(dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`))

    const remaining = 42 - daysArray.length
    for (let i = 1; i <= remaining; i++) daysArray.push(lastDay.add(i, 'day'))

    return daysArray
  }, [currentDate])

  // 🎯 GET EVENTS FOR DATE
  const getEventsForDate = useCallback(
    (date: any) => {
      return events.filter((event) => dayjs(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'))
    },
    [events]
  )

  // 🎉 GET HOLIDAY FOR DATE
  const getHolidayForDate = useCallback(
    (date: any) => {
      const dateStr = date.format('YYYY-MM-DD')
      return holidays.find((h) => h.date === dateStr)
    },
    [holidays]
  )

  const daysArray = getDaysInMonth()
  const firstDayOfMonth = currentDate.startOf('month').day()
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-orbitron font-semibold text-white">Live Calendar</h2>
          <p className="text-white/50 font-mono text-xs mt-1">Interviews • Deadlines • Holidays</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedDate(dayjs())
            setShowNewEventForm(true)
          }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            theme === 'neon'
              ? 'bg-[#13F287]/20 border border-[#13F287] text-[#13F287] shadow-[0_0_15px_rgba(19,242,135,0.3)]'
              : 'bg-[#13F287] text-[#0C0513] hover:shadow-[0_0_15px_rgba(19,242,135,0.4)]'
          }`}
        >
          <Plus size={16} /> New Event
        </motion.button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 🟢 LEFT: CALENDAR GRID */}
        <div className={`xl:col-span-2 rounded-[2rem] p-6 relative overflow-hidden transition-all duration-500 shadow-2xl ${cardBgClass}`}>
          <div
            className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${
              theme === 'neon' ? 'bg-[#6200D9]/20' : 'bg-[#6200D9]/10'
            }`}
          />

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
                className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-2xl font-orbitron font-bold text-white min-w-[150px] text-center tracking-widest">
                {currentDate.format('MMMM')} <span className="text-white/40">{currentDate.format('YYYY')}</span>
              </h2>
              <button
                onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
                className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(dayjs())}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 font-mono text-xs transition-all hidden sm:block"
              >
                Today
              </button>
            </div>

            {/* View Toggles */}
            <div className="flex bg-[#0C0513] rounded-lg p-1 border border-white/5">
              {['month', 'agenda'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-md font-mono text-xs transition-all capitalize ${
                    viewMode === mode ? `bg-[#13F287]/20 text-[#13F287]` : 'text-white/40 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-[#13F287] font-mono text-sm relative z-10">
              <Loader className="w-8 h-8 animate-spin mb-4" />
              Syncing Master Calendar...
            </div>
          ) : (
            <>
              {/* Month View */}
              {viewMode === 'month' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                  <div className="grid grid-cols-7 gap-3 mb-3">
                    {dayNames.map((day, index) => {
                      const isSunday = index === 0;
                      return (
                        <div key={day} className={`text-center font-mono text-[10px] uppercase tracking-widest mb-2 ${isSunday ? 'text-[#FF2D78] font-bold drop-shadow-[0_0_5px_rgba(255,45,120,0.5)]' : 'text-white/40'}`}>
                          {day}
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {daysArray.map((date, idx) => {
                      const isCurrentMonth = date.month() === currentDate.month()
                      const isToday = date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                      const isSunday = idx % 7 === 0
                      const holiday = getHolidayForDate(date)
                      const dayEvents = getEventsForDate(date)

                      return (
                        <motion.div
                          key={idx}
                          onClick={() => {
                            if (isCurrentMonth) {
                              setSelectedDate(date)
                              setShowNewEventForm(true)
                            }
                          }}
                          whileHover={isCurrentMonth ? { scale: 1.05, y: -2 } : {}}
                          className={`h-[90px] rounded-[1.5rem] p-2.5 transition-all border flex flex-col relative group overflow-hidden shadow-sm
                            ${
                              !isCurrentMonth
                                ? 'bg-white/[0.01] border-transparent opacity-30 cursor-default'
                                : isToday
                                ? `bg-[#13F287]/10 border-[#13F287]/50 shadow-[inset_0_0_20px_rgba(19,242,135,0.15)] cursor-pointer`
                                : isSunday
                                ? 'bg-[#FF2D78]/[0.03] border-[#FF2D78]/10 hover:border-[#FF2D78]/30 cursor-pointer'
                                : 'bg-[#0C0513]/40 border-white/5 hover:border-white/20 hover:bg-white/[0.03] cursor-pointer'
                            }`}
                        >
                          <span
                            className={`font-mono text-[11px] w-6 h-6 flex items-center justify-center rounded-full mb-1.5 transition-all
                              ${
                                isToday ? `bg-[#13F287] text-[#0C0513] font-bold shadow-[0_0_10px_#13F287]` : 
                                isSunday && isCurrentMonth ? 'text-[#FF2D78] font-semibold' : 
                                'text-white/60 group-hover:text-white'
                              }`}
                          >
                            {date.date()}
                          </span>

                          <div className="flex flex-col gap-1 w-full overflow-y-auto scrollbar-hide">
                            {/* Holiday Badge */}
                            {holiday && isCurrentMonth && (
                              <div
                                className="text-[8px] font-bold px-2 py-0.5 rounded-full w-max max-w-full truncate border border-[#FF2D78]/30"
                                style={{ backgroundColor: `${Colors.red}15`, color: Colors.red }}
                              >
                                {holiday.emoji} {holiday.title}
                              </div>
                            )}

                            {/* Event Pills */}
                            {isCurrentMonth && dayEvents.slice(0, 2).map((event: CalendarEvent) => {
                              const eColor = event.type === 'interview' ? Colors.cyan : event.type === 'deadline' ? Colors.red : Colors.purple
                              return (
                                <div
                                  key={event.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedEvent(event)
                                    setShowEventModal(true)
                                  }}
                                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border w-max max-w-full hover:brightness-125"
                                  style={{ backgroundColor: `${eColor}10`, borderColor: `${eColor}20` }}
                                >
                                  <div className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: eColor, boxShadow: `0 0 5px ${eColor}` }} />
                                  <span className="text-[8px] font-bold truncate" style={{ color: eColor }}>{event.title}</span>
                                </div>
                              )
                            })}
                            {isCurrentMonth && dayEvents.length > 2 && <div className="text-[7px] text-white/40 pl-2 font-mono">+{dayEvents.length - 2} more</div>}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Agenda View */}
              {viewMode === 'agenda' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 relative z-10 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
                  {events.length > 0 ? (
                    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((event, idx) => {
                      const eColor = event.type === 'interview' ? Colors.cyan : event.type === 'deadline' ? Colors.red : Colors.purple
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            setSelectedEvent(event)
                            setShowEventModal(true)
                          }}
                          className="bg-[#0C0513]/50 rounded-2xl border border-white/5 p-4 cursor-pointer hover:border-white/20 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: eColor, boxShadow: `0 0 10px ${eColor}` }} />
                            <div>
                              <h3 className="text-white font-bold group-hover:brightness-125 transition-colors" style={{ color: eColor }}>
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-1 text-[11px] font-mono text-white/50">
                                <span className="flex items-center gap-1"><Clock size={12} /> {dayjs(event.start).format('DD MMM YYYY, hh:mm A')}</span>
                                {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                              </div>
                            </div>
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-md text-[10px] uppercase border font-mono tracking-wider"
                            style={{ backgroundColor: `${eColor}10`, color: eColor, borderColor: `${eColor}30` }}
                          >
                            {event.type}
                          </span>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="text-center text-white/40 font-mono py-12">No events scheduled in this month.</div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* 🟢 RIGHT: UPCOMING EVENTS SIDEBAR */}
        <div className={`${cardBgClass} rounded-[2rem] p-6 relative overflow-hidden flex flex-col transition-all duration-500 shadow-2xl`}>
          <div
            className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${
              theme === 'neon' ? 'bg-[#13F287]/20' : 'bg-[#13F287]/10'
            }`}
          />

          <h3 className="text-sm font-orbitron font-semibold text-white tracking-widest uppercase mb-6 relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF2D78] animate-pulse shadow-[0_0_8px_#FF2D78]" /> Agenda Feed
          </h3>

          <div className="flex-1 space-y-4 relative z-10 overflow-y-auto scrollbar-hide pr-2">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
              </div>
            ) : events.length > 0 ? (
              events
                .slice(0, 6)
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((event) => {
                  const eColor = event.type === 'interview' ? Colors.cyan : event.type === 'deadline' ? Colors.red : Colors.purple
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventModal(true)
                      }}
                      className="bg-[#0C0513]/50 rounded-xl p-4 border border-white/5 cursor-pointer hover:border-white/20 transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 transition-all group-hover:w-1.5" style={{ backgroundColor: eColor, boxShadow: theme === 'neon' ? `0 0 10px ${eColor}` : 'none' }} />
                      <div className="pl-2">
                        <h4 className="font-bold text-white text-sm mb-1">{event.title}</h4>
                        <p className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                          <Clock size={10} style={{ color: eColor }} /> {dayjs(event.start).format('DD MMM YYYY')}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
            ) : (
              <div className="text-center text-white/40 text-xs font-mono py-8">No upcoming events</div>
            )}
          </div>
        </div>
      </div>

      {/* 🔴 EVENT DETAILS MODAL */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0C0513] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none" style={{ backgroundColor: selectedEvent.type === 'interview' ? Colors.cyan : Colors.magenta }} />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-orbitron font-bold text-white">{selectedEvent.title}</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-8 relative z-10 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-[#13F287]"><Clock size={16} /></div>
                  <div>
                    <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest">Time</p>
                    <p className="text-sm font-bold text-white">{dayjs(selectedEvent.start).format('DD MMM YYYY, hh:mm A')}</p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-[#DB66FF]"><MapPin size={16} /></div>
                    <div>
                      <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-white">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
                {selectedEvent.attendees > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-[#6200D9]"><Users size={16} /></div>
                    <div>
                      <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest">Attendees</p>
                      <p className="text-sm font-bold text-white">{selectedEvent.attendees} people</p>
                    </div>
                  </div>
                )}
                {selectedEvent.description && (
                  <div className="mt-2 pt-4 border-t border-white/5">
                     <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest mb-1">Description</p>
                     <p className="text-xs text-white/80">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (selectedEvent.id) deleteEvent(selectedEvent.id)
                }}
                className="w-full py-3.5 rounded-xl border border-[#FF2D78]/30 bg-[#FF2D78]/5 text-[#FF2D78] text-xs font-mono font-bold hover:bg-[#FF2D78]/10 hover:border-[#FF2D78]/50 transition-all flex items-center justify-center gap-2 relative z-10"
              >
                <Trash2 size={14} /> Delete Event
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 NEW EVENT MODAL */}
      <AnimatePresence>
        {showNewEventForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewEventForm(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0C0513] border border-[#13F287]/20 rounded-[2rem] p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#13F287] rounded-full blur-[80px] opacity-10 pointer-events-none" />

              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-xl bg-[#13F287]/10"><Plus className="text-[#13F287]" size={20} /></div>
                Create Event
              </h2>

              <div className="space-y-4 mb-8 relative z-10">
                <div>
                  <label className="text-[10px] font-mono text-[#13F287] uppercase tracking-widest block mb-2 font-bold">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g., System Design Interview"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#13F287] focus:ring-1 focus:ring-[#13F287]/50 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                      className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="interview">Interview</option>
                      <option value="deadline">Deadline</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Date</label>
                    <div className="w-full bg-[#121826] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#13F287] font-mono opacity-80 cursor-not-allowed">
                      {selectedDate ? selectedDate.format('DD MMM YYYY') : dayjs().format('DD MMM YYYY')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Zoom"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#13F287] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Attendees</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newEvent.attendees || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, attendees: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#13F287] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">Description</label>
                  <textarea
                    placeholder="Add details..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={2}
                    className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#13F287] focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <button
                  onClick={addEvent}
                  className="flex-1 py-3.5 rounded-xl bg-[#13F287] text-[#0C0513] font-bold text-sm hover:shadow-[0_0_20px_rgba(19,242,135,0.4)] hover:scale-[1.02] transition-all"
                >
                  Save Event
                </button>
                <button
                  onClick={() => setShowNewEventForm(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 border border-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

