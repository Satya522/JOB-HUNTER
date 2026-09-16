import { NextResponse } from 'next/server'

const Colors = {
  cyan: '#13F287',
  purple: '#6200D9',
  magenta: '#DB66FF',
  neonPink: '#FF2D78',
  red: '#EF4444',
}

// 🇮🇳 COMPREHENSIVE INDIAN HOLIDAYS DATABASE (2024-2027)
const INDIAN_HOLIDAYS_DB = {
  2024: [
    { date: '2024-01-26', name: 'Republic Day', type: 'national', description: '73rd Republic Day of India' },
    { date: '2024-03-08', name: 'Maha Shivaratri', type: 'religious', description: 'Hindu festival dedicated to Lord Shiva' },
    { date: '2024-03-25', name: 'Holi', type: 'religious', description: 'Festival of Colors' },
    { date: '2024-04-11', name: 'Eid ul-Fitr', type: 'religious', description: 'Islamic festival' },
    { date: '2024-04-17', name: 'Ram Navami', type: 'religious', description: 'Birth of Lord Rama' },
    { date: '2024-04-21', name: 'Mahavir Jayanti', type: 'religious', description: 'Jain festival' },
    { date: '2024-05-23', name: 'Buddha Purnima', type: 'religious', description: "Buddha's Birthday" },
    { date: '2024-06-17', name: 'Eid ul-Adha', type: 'religious', description: 'Islamic festival' },
    { date: '2024-07-17', name: 'Muharram', type: 'religious', description: 'Islamic New Year' },
    { date: '2024-08-15', name: 'Independence Day', type: 'national', description: 'Indian Independence Day' },
    { date: '2024-08-26', name: 'Janmashtami', type: 'religious', description: "Krishna's Birthday" },
    { date: '2024-09-16', name: 'Milad un-Nabi', type: 'religious', description: "Prophet Muhammad's Birthday" },
    { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'national', description: "Mahatma Gandhi's Birthday" },
    { date: '2024-10-12', name: 'Dussehra', type: 'religious', description: 'Victory of Good over Evil' },
    { date: '2024-11-01', name: 'Diwali', type: 'religious', description: 'Festival of Lights' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti', type: 'religious', description: "Guru Nanak's Birthday" },
    { date: '2024-12-25', name: 'Christmas', type: 'religious', description: 'Christmas Day' },
  ],
  2025: [
    { date: '2025-01-26', name: 'Republic Day', type: 'national', description: '76th Republic Day of India' },
    { date: '2025-02-13', name: 'Holi', type: 'religious', description: 'Festival of Colors' },
    { date: '2025-03-14', name: 'Maha Shivaratri', type: 'religious', description: 'Hindu festival' },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious', description: 'Christian festival' },
    { date: '2025-04-02', name: 'Eid ul-Fitr', type: 'religious', description: 'Islamic festival' },
    { date: '2025-04-10', name: 'Eid ul-Adha', type: 'religious', description: 'Islamic festival' },
    { date: '2025-04-09', name: 'Ram Navami', type: 'religious', description: 'Birth of Lord Rama' },
    { date: '2025-05-12', name: 'Buddha Purnima', type: 'religious', description: "Buddha's Birthday" },
    { date: '2025-08-15', name: 'Independence Day', type: 'national', description: 'Indian Independence Day' },
    { date: '2025-08-16', name: 'Janmashtami', type: 'religious', description: "Krishna's Birthday" },
    { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'national', description: "Mahatma Gandhi's Birthday" },
    { date: '2025-10-01', name: 'Dussehra', type: 'religious', description: 'Victory of Good over Evil' },
    { date: '2025-10-20', name: 'Diwali', type: 'religious', description: 'Festival of Lights' },
    { date: '2025-12-25', name: 'Christmas', type: 'religious', description: 'Christmas Day' },
  ],
  2026: [
    { date: '2026-01-26', name: 'Republic Day', type: 'national', description: '77th Republic Day of India' },
    { date: '2026-03-03', name: 'Holika Dahan', type: 'religious', description: 'Holika Dahan before Holi' },
    { date: '2026-03-04', name: 'Holi', type: 'religious', description: 'Festival of Colors' },
    { date: '2026-04-10', name: 'Good Friday', type: 'religious', description: 'Christian festival' },
    { date: '2026-03-31', name: 'Eid ul-Fitr', type: 'religious', description: 'Islamic festival' },
    { date: '2026-04-30', name: 'Eid ul-Adha', type: 'religious', description: 'Islamic festival' },
    { date: '2026-03-29', name: 'Ram Navami', type: 'religious', description: 'Birth of Lord Rama' },
    { date: '2026-05-31', name: 'Buddha Purnima', type: 'religious', description: "Buddha's Birthday" },
    { date: '2026-08-15', name: 'Independence Day', type: 'national', description: 'Indian Independence Day' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national', description: "Mahatma Gandhi's Birthday" },
    { date: '2026-10-20', name: 'Dussehra', type: 'religious', description: 'Victory of Good over Evil' },
    { date: '2026-11-08', name: 'Diwali', type: 'religious', description: 'Festival of Lights' },
    { date: '2026-12-25', name: 'Christmas', type: 'religious', description: 'Christmas Day' },
  ],
  2027: [
    { date: '2027-01-26', name: 'Republic Day', type: 'national', description: '78th Republic Day of India' },
    { date: '2027-03-22', name: 'Holi', type: 'religious', description: 'Festival of Colors' },
    { date: '2027-02-27', name: 'Maha Shivaratri', type: 'religious', description: 'Hindu festival' },
    { date: '2027-04-02', name: 'Good Friday', type: 'religious', description: 'Christian festival' },
    { date: '2027-03-21', name: 'Eid ul-Fitr', type: 'religious', description: 'Islamic festival' },
    { date: '2027-04-20', name: 'Eid ul-Adha', type: 'religious', description: 'Islamic festival' },
    { date: '2027-03-18', name: 'Ram Navami', type: 'religious', description: 'Birth of Lord Rama' },
    { date: '2027-05-20', name: 'Buddha Purnima', type: 'religious', description: "Buddha's Birthday" },
    { date: '2027-08-15', name: 'Independence Day', type: 'national', description: 'Indian Independence Day' },
    { date: '2027-10-02', name: 'Gandhi Jayanti', type: 'national', description: "Mahatma Gandhi's Birthday" },
    { date: '2027-10-09', name: 'Dussehra', type: 'religious', description: 'Victory of Good over Evil' },
    { date: '2027-10-29', name: 'Diwali', type: 'religious', description: 'Festival of Lights' },
    { date: '2027-12-25', name: 'Christmas', type: 'religious', description: 'Christmas Day' },
  ],
}

// 📊 MOCK DATABASE FOR EVENTS (In production, replace with MongoDB, Firebase, or PostgreSQL)
let eventsDatabase: any[] = [
  {
    id: 1,
    title: 'Google - System Design',
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    location: 'Google Meet',
    attendees: 2,
    type: 'interview',
    description: 'System Design Interview for SDE-2 role',
    userId: 'user-1',
  },
  {
    id: 2,
    title: 'Anthropic Application',
    start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Portal',
    attendees: 0,
    type: 'deadline',
    description: 'Submit application before deadline',
    userId: 'user-1',
  },
]

// 🔍 GET ALL EVENTS FOR A MONTH
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')

    const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear()
    const currentMonth = monthParam ? parseInt(monthParam) : new Date().getMonth()

    // 1. Get holidays for the month
    const holidays = (INDIAN_HOLIDAYS_DB[currentYear as keyof typeof INDIAN_HOLIDAYS_DB] || [])
      .filter((h: any) => {
        const holidayMonth = new Date(h.date).getMonth()
        return holidayMonth === currentMonth
      })
      .map((h: any) => ({
        id: `holiday-${h.date}`,
        title: h.name,
        date: h.date,
        type: 'holiday',
        typeDetail: h.type,
        description: h.description,
        emoji: h.type === 'national' ? '🇮🇳' : '🎉',
        color: Colors.neonPink,
      }))

    // 2. Get personal events for the month
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0)

    const events = eventsDatabase
      .filter((e: any) => {
        const eventDate = new Date(e.start)
        return eventDate >= monthStart && eventDate <= monthEnd
      })
      .map((e: any) => ({
        id: e.id,
        title: e.title,
        date: new Date(e.start).toISOString().split('T')[0],
        type: 'event',
        typeDetail: e.type,
        color:
          e.type === 'interview'
            ? Colors.cyan
            : e.type === 'deadline'
            ? Colors.red
            : Colors.purple,
        location: e.location,
        attendees: e.attendees,
        start: e.start,
        end: e.end,
        description: e.description,
      }))

    return NextResponse.json(
      {
        success: true,
        month: currentMonth,
        year: currentYear,
        holidays,
        events,
        totalHolidays: holidays.length,
        totalEvents: events.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Calendar GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calendar data' },
      { status: 500 }
    )
  }
}

// ✅ POST - CREATE NEW EVENT
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, location, attendees, type, start, end, description } = body

    // Validation
    if (!title || !start) {
      return NextResponse.json(
        { success: false, error: 'Title and start date are required' },
        { status: 400 }
      )
    }

    // Create event
    const newEvent = {
      id: Math.max(...eventsDatabase.map((e: any) => e.id), 0) + 1, // Generate Auto ID
      title,
      location: location || '',
      attendees: attendees || 0,
      type: type || 'meeting',
      start,
      end: end || start,
      description: description || '',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
    }

    // Save to our array (Memory DB)
    eventsDatabase.push(newEvent)

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        event: newEvent,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Calendar POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// 🔄 PUT - UPDATE EVENT
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, title, location, attendees, type, start, end, description } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const eventIndex = eventsDatabase.findIndex((e: any) => e.id === id)

    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Update event
    eventsDatabase[eventIndex] = {
      ...eventsDatabase[eventIndex],
      title: title || eventsDatabase[eventIndex].title,
      location: location !== undefined ? location : eventsDatabase[eventIndex].location,
      attendees: attendees !== undefined ? attendees : eventsDatabase[eventIndex].attendees,
      type: type || eventsDatabase[eventIndex].type,
      start: start || eventsDatabase[eventIndex].start,
      end: end || eventsDatabase[eventIndex].end,
      description: description || eventsDatabase[eventIndex].description,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Event updated successfully',
        event: eventsDatabase[eventIndex],
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Calendar PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// 🗑️ DELETE - REMOVE EVENT
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const eventIndex = eventsDatabase.findIndex((e: any) => e.id === parseInt(id))

    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    const deletedEvent = eventsDatabase.splice(eventIndex, 1)

    return NextResponse.json(
      {
        success: true,
        message: 'Event deleted successfully',
        event: deletedEvent[0],
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Calendar DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}