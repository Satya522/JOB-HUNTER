import { NextResponse } from 'next/server'

const Colors = { cyan: '#13F287', purple: '#6200D9', magenta: '#DB66FF', red: '#FF2D78', yellow: '#FFD700', blue: '#3B82F6' }

// 🏢 MOCK DATABASE - APPLIED JOBS (In-Memory for now)
let appliedJobsDatabase: any[] = [
  { id: 1, companyName: 'Google', position: 'Senior Software Engineer', location: 'Mountain View, CA', salary: { min: 180000, max: 250000, currency: 'USD' }, appliedDate: '2024-01-15', status: 'interview', interviewRound: 2, totalRounds: 4, jobType: 'Full-time', description: 'Looking for an experienced SDE to lead backend systems', link: 'https://careers.google.com/...', companyLogo: 'G', matchScore: 92, notes: 'Great company culture', interviewDates: ['2024-02-01'], skills: ['System Design', 'C++', 'Go'] },
  { id: 2, companyName: 'Meta', position: 'Staff Engineer', location: 'Menlo Park, CA', salary: { min: 200000, max: 280000, currency: 'USD' }, appliedDate: '2024-01-12', status: 'screening', interviewRound: 1, totalRounds: 4, jobType: 'Full-time', description: 'Building next-generation AI systems at scale', link: 'https://metacareers.com/...', companyLogo: 'M', matchScore: 88, notes: 'Waiting for HR results', interviewDates: [], skills: ['Python', 'ML'] },
  { id: 3, companyName: 'Microsoft', position: 'Principal Engineer', location: 'Seattle, WA', salary: { min: 220000, max: 320000, currency: 'USD' }, appliedDate: '2024-01-10', status: 'applied', interviewRound: 0, totalRounds: 5, jobType: 'Full-time', description: 'Lead architectural decisions', link: 'https://careers.microsoft.com/...', companyLogo: 'MS', matchScore: 85, notes: 'Referral', interviewDates: [], skills: ['Cloud', 'Azure'] },
  { id: 4, companyName: 'Amazon', position: 'SDE Manager', location: 'Seattle, WA', salary: { min: 190000, max: 260000, currency: 'USD' }, appliedDate: '2024-01-18', status: 'offer', interviewRound: 4, totalRounds: 4, jobType: 'Full-time', description: 'Lead high-performing teams', link: 'https://amazon.jobs/...', companyLogo: 'A', matchScore: 90, notes: 'Offer received!', interviewDates: [], skills: ['Leadership', 'Java'] },
  { id: 5, companyName: 'Netflix', position: 'Systems Engineer', location: 'Los Gatos, CA', salary: { min: 195000, max: 270000, currency: 'USD' }, appliedDate: '2024-01-20', status: 'rejected', interviewRound: 2, totalRounds: 4, jobType: 'Full-time', description: 'Design systems', link: 'https://jobs.netflix.com/...', companyLogo: 'N', matchScore: 94, notes: 'Rejected in round 2', interviewDates: [], skills: ['Go', 'Kafka'] },
]

// ✅ GET - FETCH APPLIED JOBS WITH FILTERS & STATS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    
    let filtered = [...appliedJobsDatabase]

    if (search) {
      filtered = filtered.filter(job =>
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.position.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Advanced Stats Calculation
    const stats = {
      total: appliedJobsDatabase.length,
      applied: appliedJobsDatabase.filter(j => j.status === 'applied').length,
      screening: appliedJobsDatabase.filter(j => j.status === 'screening').length,
      interview: appliedJobsDatabase.filter(j => j.status === 'interview').length,
      offer: appliedJobsDatabase.filter(j => j.status === 'offer').length,
      rejected: appliedJobsDatabase.filter(j => j.status === 'rejected').length,
    }

    return NextResponse.json({ success: true, data: filtered, stats, total: filtered.length })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

// ✅ POST - CREATE NEW JOB
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newJob = {
      id: Math.max(...appliedJobsDatabase.map(j => j.id), 0) + 1,
      companyName: body.companyName,
      position: body.position,
      location: body.location,
      salary: body.salary || { min: 0, max: 0, currency: 'USD' },
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      jobType: body.jobType || 'Full-time',
      link: body.link || '',
      companyLogo: body.companyName.charAt(0).toUpperCase(),
      matchScore: 85,
    }
    appliedJobsDatabase.push(newJob)
    return NextResponse.json({ success: true, data: newJob }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 })
  }
}

// ✅ PUT - UPDATE JOB STATUS
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const jobIndex = appliedJobsDatabase.findIndex(j => j.id === body.id)
    if (jobIndex === -1) return NextResponse.json({ success: false }, { status: 404 })
    
    appliedJobsDatabase[jobIndex] = { ...appliedJobsDatabase[jobIndex], ...body }
    return NextResponse.json({ success: true, data: appliedJobsDatabase[jobIndex] })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// ✅ DELETE - REMOVE JOB
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id') || '0')
    const jobIndex = appliedJobsDatabase.findIndex(j => j.id === id)
    if (jobIndex === -1) return NextResponse.json({ success: false }, { status: 404 })
    
    const deletedJob = appliedJobsDatabase.splice(jobIndex, 1)
    return NextResponse.json({ success: true, data: deletedJob[0] })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}