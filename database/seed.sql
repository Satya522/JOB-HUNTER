-- ✅ SEED.SQL - FIXED VERSION
-- 
-- Changes Made:
-- 1. JobStatus values fixed: PHONE_SCREEN → INTERVIEW (✅ FIXED)
-- 2. JobStatus values fixed: TECHNICAL → INTERVIEW (✅ FIXED)
-- 3. JobStatus values fixed: HIRED removed (✅ FIXED)
-- 4. All status values now match backend enum: APPLIED, INTERVIEW, OFFER, REJECTED, WITHDRAWN
-- 5. Added detailed comments for clarity
--
-- Valid JobStatus values:
--   - APPLIED (initial application)
--   - INTERVIEW (in interview process)
--   - OFFER (offer received)
--   - REJECTED (application rejected)
--   - WITHDRAWN (application withdrawn by user)

-- ===== SAMPLE USERS =====
-- Purpose: Create test users for development
INSERT INTO users (id, full_name, email, password_hash, location, github_username, leetcode_username, preferred_roles, preferred_locs)
VALUES 
  -- User 1: John Doe (ML Engineer)
  (gen_random_uuid(), 'John Doe', 'john.doe@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', 'San Francisco, CA', 'johndoe', 'johndoe123', ARRAY['ML Engineer', 'Data Scientist'], ARRAY['Remote', 'San Francisco']),
  
  -- User 2: Jane Smith (AI Researcher)
  (gen_random_uuid(), 'Jane Smith', 'jane.smith@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', 'New York, NY', 'janesmith', 'janesmith456', ARRAY['Software Engineer', 'AI Researcher'], ARRAY['New York', 'Remote']);

-- ===== SAMPLE JOB APPLICATIONS & NOTIFICATIONS =====
-- Purpose: Create test data for both users with different job application statuses
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
BEGIN
  -- Get the user IDs from the just-inserted users
  SELECT id INTO user1_id FROM users WHERE email = 'john.doe@email.com';
  SELECT id INTO user2_id FROM users WHERE email = 'jane.smith@email.com';

  -- ===== USER 1: JOHN DOE - JOB APPLICATIONS =====
  -- ✅ Status values: APPLIED, INTERVIEW, OFFER, REJECTED, WITHDRAWN
  INSERT INTO job_applications (user_id, company_name, job_title, status, salary_min, salary_max, location, match_percentage, applied_date, source, priority)
  VALUES 
    -- Status: INTERVIEW (✅ FIXED: was INTERVIEW, now INTERVIEW - correct)
    (user1_id, 'OpenAI', 'Senior ML Engineer', 'INTERVIEW', 180000, 240000, 'San Francisco, CA', 96, '2026-02-15', 'LinkedIn', 'HIGH'),
    
    -- Status: INTERVIEW (✅ FIXED: was TECHNICAL, now INTERVIEW)
    (user1_id, 'Anthropic', 'AI Research Scientist', 'INTERVIEW', 200000, 280000, 'San Francisco, CA', 94, '2026-02-18', 'Direct', 'HIGH'),
    
    -- Status: INTERVIEW (✅ FIXED: was PHONE_SCREEN, now INTERVIEW)
    (user1_id, 'Google DeepMind', 'Research Engineer', 'INTERVIEW', 190000, 260000, 'Remote', 89, '2026-02-20', 'Referral', 'HIGH'),
    
    -- Status: APPLIED (initial application, no response yet)
    (user1_id, 'Google', 'Machine Learning Engineer', 'APPLIED', 170000, 220000, 'Remote', 88, '2026-02-16', 'LinkedIn', 'MEDIUM'),
    
    -- Status: OFFER (✅ FIXED: was offer, now OFFER - correct)
    (user1_id, 'LinkedIn', 'Senior Data Scientist', 'OFFER', 165000, 210000, 'Mumbai, India', 82, '2026-02-10', 'Job Board', 'HIGH'),
    
    -- Status: APPLIED (waiting for response)
    (user1_id, 'Microsoft', 'Applied Scientist', 'APPLIED', 155000, 200000, 'Thane/Remote', 77, '2026-02-12', 'Company Website', 'MEDIUM'),
    
    -- Status: REJECTED (application not successful)
    (user1_id, 'Meta', 'AI Engineer', 'REJECTED', 160000, 205000, 'Remote', 71, '2026-02-08', 'LinkedIn', 'LOW'),
    
    -- Status: APPLIED (new application)
    (user1_id, 'Nvidia', 'Deep Learning Engineer', 'APPLIED', 175000, 230000, 'Santa Clara, CA', 75, '2026-02-14', 'Referral', 'MEDIUM');

  -- ===== USER 2: JANE SMITH - JOB APPLICATIONS =====
  INSERT INTO job_applications (user_id, company_name, job_title, status, salary_min, salary_max, location, match_percentage, applied_date, source, priority)
  VALUES 
    -- Status: INTERVIEW (in interview process)
    (user2_id, 'Amazon', 'Applied Scientist', 'INTERVIEW', 160000, 220000, 'Seattle, WA', 85, '2026-02-17', 'LinkedIn', 'HIGH'),
    
    -- Status: INTERVIEW (ongoing interviews)
    (user2_id, 'Netflix', 'Machine Learning Engineer', 'INTERVIEW', 200000, 300000, 'Los Gatos, CA', 91, '2026-02-19', 'Referral', 'HIGH'),
    
    -- Status: APPLIED (recently applied)
    (user2_id, 'Tesla', 'Autopilot Engineer', 'APPLIED', 150000, 200000, 'Palo Alto, CA', 78, '2026-02-21', 'Company Website', 'MEDIUM');

  -- ===== USER 1: NOTIFICATIONS =====
  INSERT INTO notifications (user_id, type, title, message, is_read)
  VALUES 
    (user1_id, 'MATCH', 'New AI Match', 'Your profile matched Senior ML Engineer at OpenAI', false),
    (user1_id, 'INTERVIEW', 'Interview Scheduled', 'Technical interview with DeepMind on Feb 25', false),
    (user1_id, 'VIEWED', 'Application Viewed', 'Google viewed your application', true),
    (user1_id, 'OFFER', 'Offer Received!', 'LinkedIn has extended an offer', false),
    (user1_id, 'AI_SUGGESTION', 'Resume Optimized', 'AI suggestions applied to your resume', true);

  -- ===== USER 1: GOALS =====
  INSERT INTO goals (user_id, goal_type, target_value, current_value, period_start, period_end)
  VALUES 
    (user1_id, 'APPLICATIONS_PER_WEEK', 10, 7, '2026-02-17', '2026-02-23'),
    (user1_id, 'INTERVIEWS_PER_MONTH', 5, 3, '2026-02-01', '2026-02-28'),
    (user1_id, 'NETWORK_CONNECTIONS', 50, 32, '2026-01-01', '2026-03-31');

END $$;

-- ===== SUMMARY OF FIXES =====
-- ✅ FIX #1: PHONE_SCREEN → INTERVIEW (not a valid status)
-- ✅ FIX #2: TECHNICAL → INTERVIEW (not a valid status)
-- ✅ FIX #3: HIRED removed (not a valid status)
-- ✅ Valid JobStatus values:
--    - APPLIED: Initial application submitted
--    - INTERVIEW: In interview process
--    - OFFER: Job offer received
--    - REJECTED: Application rejected
--    - WITHDRAWN: User withdrew application
