export interface User {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
  location?: string
  githubUsername?: string
  linkedinUrl?: string
  leetcodeUsername?: string
  preferredRoles?: string[]
  preferredLocations?: string[]
}

export interface JobApplication {
  id: string
  userId: string
  companyName: string
  jobTitle: string
  jobUrl?: string
  status: JobStatus
  salaryMin?: number
  salaryMax?: number
  location?: string
  jobType?: string
  roleType?: string
  matchPercentage?: number
  appliedDate?: string
  responseDate?: string
  notes?: string
  source?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  updatedAt: string
}

// ✅ FIXED: Matches backend JobStatus enum exactly
export type JobStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN'

// ✅ Helper: Map status to display label
export const JobStatusLabels: Record<JobStatus, string> = {
  'APPLIED': 'Applied',
  'INTERVIEW': 'Interview',
  'OFFER': 'Offer',
  'REJECTED': 'Rejected',
  'WITHDRAWN': 'Withdrawn',
}

// ✅ Helper: Map status to color for UI
export const JobStatusColors: Record<JobStatus, string> = {
  'APPLIED': '#00F5FF',
  'INTERVIEW': '#FFB800',
  'OFFER': '#00FFA3',
  'REJECTED': '#FF2D78',
  'WITHDRAWN': '#7B61FF',
}

export interface Resume {
  id: string
  userId: string
  fileName: string
  fileUrl: string  // ✅ FIXED: Changed from filePath
  fileSize?: number
  extractedText?: string
  atsScore?: number
  versionName?: string
  isPrimary: boolean  // ✅ FIXED: Changed from isDefault
  uploadedAt: string
}

export interface AtsAnalysis {
  id: string
  userId: string
  resumeId: string
  jobTitle: string
  jobDescription: string
  matchPercentage: number
  matchingKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  atsScore: number
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface Company {
  name: string
  match: number
  emoji: string
  salary: string
  location: string
  days: number
  color: string
  hot?: boolean
}

export interface TimelineEvent {
  type: string
  icon: string
  color: string
  text: string
  company: string
  time: string
}

export interface AiInsight {
  priority: 'critical' | 'forecast' | 'optimize' | 'timing' | 'network' | 'skill'
  icon: string
  text: string
  action: string
  color: string
}

export interface GaugeData {
  label: string
  value: number
  unit: string
  color: string
}

export interface PipelineStage {
  stage: string
  count: number
  color: string
}

export interface CodingPlatformStats {
  platform: 'leetcode' | 'gfg' | 'codingninjas' | 'github'
  username: string
  solved?: number
  rank?: number
  streak?: number
  contributions?: number
}

export interface JobFeedItem {
  id: string
  source: string
  company: string
  title: string
  location: string
  salary?: string
  postedAt: string
  matchPercentage?: number
  tags: string[]
  url: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  userId: string
  fullName: string
  email: string
  avatarUrl?: string
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  location?: string
}
