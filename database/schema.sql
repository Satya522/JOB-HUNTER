-- ✅ SCHEMA.SQL - FIXED VERSION
-- 
-- Changes Made:
-- 1. Resumes table: file_path → file_url (✅ FIXED)
-- 2. Resumes table: is_default → is_primary (✅ FIXED)
-- 3. All other tables remain same
-- 4. Added detailed comments for clarity

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== USERS TABLE =====
-- Purpose: Store user accounts and profile information
CREATE TABLE users (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        VARCHAR(100) NOT NULL,
  email            VARCHAR(100) UNIQUE,
  phone            VARCHAR(20),
  password_hash    VARCHAR(255) NOT NULL,
  avatar_url       VARCHAR(500),
  github_username  VARCHAR(100),
  linkedin_url     VARCHAR(500),
  leetcode_username VARCHAR(100),
  gfg_username     VARCHAR(100),
  cn_username      VARCHAR(100),
  location         VARCHAR(200),
  preferred_roles  TEXT[],
  preferred_locs   TEXT[],
  is_active        BOOLEAN     DEFAULT true,
  created_at       TIMESTAMP   DEFAULT NOW(),
  updated_at       TIMESTAMP   DEFAULT NOW()
);

-- ===== JOB APPLICATIONS TABLE =====
-- Purpose: Track all job applications by users
-- Status values: APPLIED, INTERVIEW, OFFER, REJECTED, WITHDRAWN (FIXED)
CREATE TABLE job_applications (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES users(id) ON DELETE CASCADE,
  company_name     VARCHAR(200) NOT NULL,
  job_title        VARCHAR(200) NOT NULL,
  job_url          VARCHAR(1000),
  status           VARCHAR(50)  DEFAULT 'APPLIED',
  -- ✅ FIXED: Status values are now: APPLIED, INTERVIEW, OFFER, REJECTED, WITHDRAWN
  salary_min       INTEGER,
  salary_max       INTEGER,
  location         VARCHAR(200),
  job_type         VARCHAR(50),
  role_type        VARCHAR(50),
  match_percentage INTEGER,
  applied_date     DATE,
  response_date    DATE,
  notes            TEXT,
  resume_version   VARCHAR(100),
  cover_letter     BOOLEAN      DEFAULT false,
  source           VARCHAR(100),
  contact_name     VARCHAR(200),
  contact_email    VARCHAR(200),
  follow_up_date   DATE,
  priority         VARCHAR(20)  DEFAULT 'MEDIUM',
  kanban_order     INTEGER      DEFAULT 0,
  created_at       TIMESTAMP   DEFAULT NOW(),
  updated_at       TIMESTAMP   DEFAULT NOW()
);

-- ===== RESUMES TABLE =====
-- Purpose: Store user resume files
-- ✅ FIXES APPLIED:
--   1. file_path → file_url (matches backend Resume entity)
--   2. is_default → is_primary (matches backend Resume entity)
CREATE TABLE resumes (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        REFERENCES users(id) ON DELETE CASCADE,
  file_name     VARCHAR(255) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,  -- ✅ FIXED: was file_path, now file_url
  file_size     INTEGER,
  extracted_text TEXT,
  ats_score     INTEGER,
  version_name  VARCHAR(100),
  is_primary    BOOLEAN     DEFAULT false,  -- ✅ FIXED: was is_default, now is_primary
  uploaded_at   TIMESTAMP   DEFAULT NOW()
);

-- ===== ATS ANALYSES TABLE =====
-- Purpose: Store resume vs job analysis results
-- Used by: POST /api/ats/analyze endpoint
CREATE TABLE ats_analyses (
  id                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID  REFERENCES users(id),
  resume_id           UUID  REFERENCES resumes(id),
  job_title           VARCHAR(200),
  job_description     TEXT,
  match_percentage    INTEGER,
  matching_keywords   TEXT[],
  missing_keywords    TEXT[],
  suggestions         TEXT[],
  ats_score           INTEGER,
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ===== AI SUGGESTIONS TABLE =====
-- Purpose: Store AI-generated suggestions (cover letters, interview tips, etc)
-- Used by: 
--   - POST /api/ai/cover-letter
--   - POST /api/ai/interview-prep
--   - POST /api/ai/salary-insights
--   - POST /api/ai/insights
CREATE TABLE ai_suggestions (
  id                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID  REFERENCES users(id),
  job_application_id  UUID  REFERENCES job_applications(id),
  suggestion_type     VARCHAR(100),  -- COVER_LETTER, INTERVIEW_PREP, SALARY_INSIGHTS, GENERAL_INSIGHTS
  prompt_used         TEXT,
  ai_response         TEXT,
  model_used          VARCHAR(100) DEFAULT 'gemini-1.5-pro',
  tokens_used         INTEGER,
  rating              INTEGER,
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ===== NOTIFICATIONS TABLE =====
-- Purpose: Store user notifications
CREATE TABLE notifications (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID  REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(100),
  title       VARCHAR(300),
  message     TEXT,
  is_read     BOOLEAN   DEFAULT false,
  action_url  VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ===== SAVED JOBS TABLE =====
-- Purpose: Store jobs saved from external APIs (Remotive, Jobicy, Adzuna)
CREATE TABLE saved_jobs (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID  REFERENCES users(id) ON DELETE CASCADE,
  external_job_id VARCHAR(200),
  source          VARCHAR(100),  -- remotive, jobicy, adzuna
  company_name    VARCHAR(200),
  job_title       VARCHAR(200),
  job_url         VARCHAR(1000),
  salary_range    VARCHAR(100),
  location        VARCHAR(200),
  posted_date     DATE,
  raw_data        JSONB,
  saved_at        TIMESTAMP DEFAULT NOW()
);

-- ===== GOALS TABLE =====
-- Purpose: Track user goals and progress
CREATE TABLE goals (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID  REFERENCES users(id) ON DELETE CASCADE,
  goal_type      VARCHAR(100),
  target_value   INTEGER,
  current_value  INTEGER DEFAULT 0,
  period_start   DATE,
  period_end     DATE,
  is_completed   BOOLEAN DEFAULT false,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ===== CONTACTS TABLE =====
-- Purpose: CRM - Store networking contacts and referrals
CREATE TABLE contacts (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID  REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(200),
  role          VARCHAR(200),
  company       VARCHAR(200),
  email         VARCHAR(200),
  linkedin_url  VARCHAR(500),
  notes         TEXT,
  is_referral   BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ===== PERFORMANCE INDEXES =====
-- Purpose: Improve query performance for common operations
CREATE INDEX idx_jobs_user_status   ON job_applications(user_id, status);
CREATE INDEX idx_jobs_applied_date  ON job_applications(applied_date);
CREATE INDEX idx_notif_user_unread  ON notifications(user_id, is_read);
CREATE INDEX idx_jobs_kanban        ON job_applications(user_id, kanban_order);
CREATE INDEX idx_users_email        ON users(email);

-- ===== SUMMARY OF FIXES =====
-- 1. ✅ Resumes.file_path → Resumes.file_url (matches backend Resume entity)
-- 2. ✅ Resumes.is_default → Resumes.is_primary (matches backend Resume entity)
-- 3. ✅ All other tables and columns are correct
