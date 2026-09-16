// import axios from 'axios'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     // ✅ FIXED: Safe localStorage access
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token')
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // ✅ FIXED: Safe localStorage access
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token')
//         window.location.href = '/login'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

// // Auth API
// export const authApi = {
//   login: (email: string, password: string) =>
//     api.post('/auth/login', { email, password }),
  
//   register: (fullName: string, email: string, password: string, location?: string) =>
//     api.post('/auth/register', { fullName, email, password, location }),
  
//   refreshToken: (token: string) =>
//     api.post('/auth/refresh', null, { headers: { Authorization: `Bearer ${token}` } }),
  
//   forgotPassword: (email: string) =>
//     api.post('/auth/forgot-password', null, { params: { email } }),
// }

// // Jobs API
// export const jobsApi = {
//   getAll: (params?: { status?: string; search?: string }) =>
//     api.get('/jobs', { params }),
  
//   getById: (id: string) =>
//     api.get(`/jobs/${id}`),
  
//   create: (data: unknown) =>
//     api.post('/jobs', data),
  
//   update: (id: string, data: unknown) =>
//     api.put(`/jobs/${id}`, data),
  
//   delete: (id: string) =>
//     api.delete(`/jobs/${id}`),
  
//   updateStatus: (id: string, status: string) =>
//     api.patch(`/jobs/${id}/status`, null, { params: { status } }),
  
//   getStats: () =>
//     api.get('/jobs/stats/overview'),
// }

// // Resume API
// export const resumeApi = {
//   upload: (file: File) => {
//     const formData = new FormData()
//     formData.append('file', file)
//     return api.post('/resumes/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
  
//   getAll: () =>
//     api.get('/resumes'),
  
//   analyze: (resumeId: string, jobDescription: string) =>
//     api.post('/ats/analyze', { resumeId, jobDescription }),
// }

// // AI API
// export const aiApi = {
//   generateCoverLetter: (jobTitle: string, company: string, resumeSummary: string, jd: string) =>
//     api.post('/ai/cover-letter', { jobTitle, company, resumeSummary, jd }),
  
//   getInterviewQuestions: (jobTitle: string, company: string) =>
//     api.post('/ai/interview-prep', { jobTitle, company }),
  
//   getSalaryInsights: (title: string, location: string, yearsExp: number) =>
//     api.post('/ai/salary-insights', { title, location, yearsExp }),
  
//   getInsights: () =>
//     api.post('/ai/insights'),
// }

// // Job Feed API
// export const jobFeedApi = {
//   getRemotiveJobs: (search?: string, limit = 20) =>
//     api.get('/jobs/feed/remotive', { params: { search, limit } }),
  
//   getJobicyJobs: (geo?: string, industry?: string) =>
//     api.get('/jobs/feed/jobicy', { params: { geo, industry } }),
  
//   getAdzunaJobs: (what: string, where?: string) =>
//     api.get('/jobs/feed/adzuna', { params: { what, where } }),
// }

// export default api


import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // ✅ FIXED: Safe localStorage access
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ FIXED: Safe localStorage access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (fullName: string, email: string, password: string, location?: string) =>
    api.post('/auth/register', { fullName, email, password, location }),
  
  refreshToken: (token: string) =>
    api.post('/auth/refresh', null, { headers: { Authorization: `Bearer ${token}` } }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', null, { params: { email } }),

  // 👇 YAHAN HAI NAYA SOCIAL LOGIN METHOD 👇
  socialLogin: (payload: {
    email: string | null;
    fullName: string | null;
    provider: string; // 'GOOGLE', 'GITHUB', 'FACEBOOK'
    providerId: string;
    avatarUrl: string | null;
  }) => api.post('/auth/social-login', payload),
}

// Jobs API
export const jobsApi = {
  getAll: (params?: { status?: string; search?: string }) =>
    api.get('/jobs', { params }),
  
  getById: (id: string) =>
    api.get(`/jobs/${id}`),
  
  create: (data: unknown) =>
    api.post('/jobs', data),
  
  update: (id: string, data: unknown) =>
    api.put(`/jobs/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/jobs/${id}`),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/jobs/${id}/status`, null, { params: { status } }),
  
  getStats: () =>
    api.get('/jobs/stats/overview'),
}

// Resume API
export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  getAll: () =>
    api.get('/resumes'),
  
  analyze: (resumeId: string, jobDescription: string) =>
    api.post('/ats/analyze', { resumeId, jobDescription }),
}

// AI API
export const aiApi = {
  generateCoverLetter: (jobTitle: string, company: string, resumeSummary: string, jd: string) =>
    api.post('/ai/cover-letter', { jobTitle, company, resumeSummary, jd }),
  
  getInterviewQuestions: (jobTitle: string, company: string) =>
    api.post('/ai/interview-prep', { jobTitle, company }),
  
  getSalaryInsights: (title: string, location: string, yearsExp: number) =>
    api.post('/ai/salary-insights', { title, location, yearsExp }),
  
  getInsights: () =>
    api.post('/ai/insights'),
}

// Job Feed API
export const jobFeedApi = {
  getRemotiveJobs: (search?: string, limit = 20) =>
    api.get('/jobs/feed/remotive', { params: { search, limit } }),
  
  getJobicyJobs: (geo?: string, industry?: string) =>
    api.get('/jobs/feed/jobicy', { params: { geo, industry } }),
  
  getAdzunaJobs: (what: string, where?: string) =>
    api.get('/jobs/feed/adzuna', { params: { what, where } }),
}

export default api

