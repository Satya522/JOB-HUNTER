-- Database Schema for AI Job Hunter
-- PostgreSQL 15+

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    github_username VARCHAR(100),
    linkedin_url VARCHAR(500),
    leetcode_username VARCHAR(100),
    gfg_username VARCHAR(100),
    cn_username VARCHAR(100),
    location VARCHAR(200),
    preferred_roles TEXT,
    preferred_locs TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================================
-- RESUMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    version INTEGER NOT NULL,
    content TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_version ON resumes(version);

-- ============================================================================
-- JOB APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    job_url VARCHAR(1000),
    status VARCHAR(50) DEFAULT 'APPLIED',
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(200),
    job_type VARCHAR(50),
    role_type VARCHAR(50),
    match_percentage INTEGER,
    applied_date DATE,
    response_date DATE,
    notes TEXT,
    resume_version VARCHAR(100),
    cover_letter BOOLEAN DEFAULT false,
    source VARCHAR(100),
    contact_name VARCHAR(200),
    contact_email VARCHAR(200),
    follow_up_date DATE,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    kanban_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_company ON job_applications(company_name);
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at);

-- ============================================================================
-- JOB STATUS ENUM
-- ============================================================================
-- In PostgreSQL, we use VARCHAR with CHECK constraint instead of ENUM for better flexibility
ALTER TABLE job_applications
ADD CONSTRAINT chk_job_status CHECK (status IN ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'));

-- ============================================================================
-- INTERVIEWS TABLE (Optional - for calendar feature)
-- ============================================================================
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_date TIMESTAMP NOT NULL,
    interview_type VARCHAR(50),
    interviewer_name VARCHAR(200),
    interviewer_email VARCHAR(200),
    location VARCHAR(500),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_job_id ON interviews(job_application_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);

-- ============================================================================
-- AI INSIGHTS TABLE (For caching AI-generated content)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);

-- ============================================================================
-- COVER LETTERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    template_used VARCHAR(200),
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_job_id ON cover_letters(job_application_id);

-- ============================================================================
-- JWT TOKENS BLACKLIST (For logout feature)
-- ============================================================================
CREATE TABLE IF NOT EXISTS token_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_token_blacklist_user_id ON token_blacklist(user_id);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- SAMPLE DATA (Optional - Remove for production)
-- ============================================================================
-- Insert a test user
INSERT INTO users (full_name, email, password_hash, location, is_active)
VALUES (
    'Test User',
    'test@example.com',
    '$2a$12$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ',
    'San Francisco, CA',
    true
) ON CONFLICT (email) DO NOTHING;
