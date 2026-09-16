package com.jobhunter.controller;

import com.jobhunter.service.JobFeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ✅ FILE #10: JobFeedController
 * 
 * Purpose: Fetch jobs from external job boards APIs
 * Base URL: /api/jobs/feed
 * 
 * Endpoints:
 *   - GET /api/jobs/feed/remotive - Jobs from Remotive API
 *   - GET /api/jobs/feed/jobicy - Jobs from Jobicy API
 *   - GET /api/jobs/feed/adzuna - Jobs from Adzuna API
 * 
 * External APIs Used:
 *   - Remotive: https://remotive.com/api/remote-jobs (FREE, No key needed)
 *   - Jobicy: https://jobicy.com/api/v2/remote-jobs (FREE, No key needed)
 *   - Adzuna: https://developer.adzuna.com/ (Requires free registration)
 * 
 * Used by: Frontend to show external job listings
 */
@RestController
@RequestMapping("/api/jobs/feed")
@RequiredArgsConstructor
@Slf4j
public class JobFeedController {
    
    // ===== DEPENDENCIES =====
    private final JobFeedService jobFeedService; // FILE #11: Handles API calls
    
    /**
     * GET /api/jobs/feed/remotive
     * 
     * Fetch remote jobs from Remotive API
     * 
     * Query Parameters:
     *   - search: string (optional) - Search keyword
     *   - limit: int (default 20) - Number of results
     * 
     * Response: 200 OK
     *   List of job objects from Remotive
     * 
     * API Documentation:
     *   https://github.com/remotive-com/remote-jobs-api
     * 
     * Example:
     *   curl -X GET "http://localhost:8080/api/jobs/feed/remotive?search=python&limit=10"
     */
    @GetMapping("/remotive")
    public ResponseEntity<List<Map<String, Object>>> getRomotiveJobs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "20") int limit) {
        
        log.info("🌐 Fetching Remotive jobs - search: {}, limit: {}", search, limit);
        
        List<Map<String, Object>> jobs = jobFeedService.fetchRomotiveJobs(search, limit);
        
        log.info("✅ Found {} jobs from Remotive", jobs.size());
        
        return ResponseEntity.ok(jobs);
    }
    
    /**
     * GET /api/jobs/feed/jobicy
     * 
     * Fetch remote jobs from Jobicy API
     * 
     * Query Parameters:
     *   - geo: string (optional) - Country code (e.g., IN, US)
     *   - industry: string (optional) - Industry filter
     *   - limit: int (default 20) - Number of results
     * 
     * Response: 200 OK
     *   List of job objects from Jobicy
     * 
     * API Documentation:
     *   https://jobicy.com/api/documentation
     * 
     * Example:
     *   curl -X GET "http://localhost:8080/api/jobs/feed/jobicy?geo=IN&limit=10"
     */
    @GetMapping("/jobicy")
    public ResponseEntity<List<Map<String, Object>>> getJobicyJobs(
            @RequestParam(required = false) String geo,
            @RequestParam(required = false) String industry,
            @RequestParam(defaultValue = "20") int limit) {
        
        log.info("🌐 Fetching Jobicy jobs - geo: {}, industry: {}, limit: {}", geo, industry, limit);
        
        List<Map<String, Object>> jobs = jobFeedService.fetchJobicyJobs(geo, industry, limit);
        
        log.info("✅ Found {} jobs from Jobicy", jobs.size());
        
        return ResponseEntity.ok(jobs);
    }
    
    /**
     * GET /api/jobs/feed/adzuna
     * 
     * Fetch jobs from Adzuna API
     * 
     * Query Parameters:
     *   - what: string (REQUIRED) - Job title or keyword
     *   - where: string (optional) - Location
     *   - limit: int (default 20) - Number of results
     * 
     * Response: 200 OK
     *   List of job objects from Adzuna
     * 
     * API Setup:
     *   1. Sign up at https://developer.adzuna.com/
     *   2. Get app_id and api_key
     *   3. Add to .env:
     *      ADZUNA_APP_ID=your_app_id
     *      ADZUNA_API_KEY=your_api_key
     * 
     * Example:
     *   curl -X GET "http://localhost:8080/api/jobs/feed/adzuna?what=python&where=India&limit=10"
     */
    @GetMapping("/adzuna")
    public ResponseEntity<List<Map<String, Object>>> getAdzunaJobs(
            @RequestParam String what,
            @RequestParam(required = false) String where,
            @RequestParam(defaultValue = "20") int limit) {
        
        log.info("🌐 Fetching Adzuna jobs - what: {}, where: {}, limit: {}", what, where, limit);
        
        if (what == null || what.trim().isEmpty()) {
            throw new RuntimeException("Parameter 'what' (job title) is required");
        }
        
        List<Map<String, Object>> jobs = jobFeedService.fetchAdzunaJobs(what, where, limit);
        
        log.info("✅ Found {} jobs from Adzuna", jobs.size());
        
        return ResponseEntity.ok(jobs);
    }
}
