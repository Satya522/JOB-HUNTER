package com.jobhunter.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

/**
 * ✅ FILE #11: JobFeedService
 * 
 * Purpose: Fetch jobs from external job board APIs
 * Used by: JobFeedController (FILE #10)
 * 
 * External APIs Called:
 *   1. Remotive: https://remotive.com/api/remote-jobs (FREE)
 *   2. Jobicy: https://jobicy.com/api/v2/remote-jobs (FREE)
 *   3. Adzuna: https://api.adzuna.com/v1/api/jobs/{country_code}/search/1 (Requires API key)
 * 
 * Methods:
 *   - fetchRomotiveJobs()
 *   - fetchJobicyJobs()
 *   - fetchAdzunaJobs()
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JobFeedService {
    
    // ===== DEPENDENCIES =====
    private final RestTemplate restTemplate; // For making HTTP calls to external APIs
    private final ObjectMapper objectMapper;  // For parsing JSON responses
    
    // ===== CONFIGURATION =====
    // Adzuna API credentials (from .env file)
    @Value("${adzuna.app-id:}")
    private String adzunaAppId;
    
    @Value("${adzuna.api-key:}")
    private String adzunaApiKey;
    
    // API Endpoints
    private static final String REMOTIVE_API = "https://remotive.com/api/remote-jobs";
    private static final String JOBICY_API = "https://jobicy.com/api/v2/remote-jobs";
    private static final String ADZUNA_API = "https://api.adzuna.com/v1/api/jobs/in/search/1";
    
    /**
     * Fetch remote jobs from Remotive API
     * 
     * ✅ REMOTIVE API DOCUMENTATION:
     *    GitHub: https://github.com/remotive-com/remote-jobs-api
     *    Free: Yes, No authentication needed
     * 
     * @param search Keyword to search (optional)
     * @param limit Number of results to return
     * @return List of job listings
     */
    public List<Map<String, Object>> fetchRomotiveJobs(String search, int limit) {
        try {
            log.info("📡 Calling Remotive API...");
            
            // Step 1: Build URL
            String url = REMOTIVE_API;
            if (search != null && !search.isEmpty()) {
                url += "?search=" + search;
            }
            
            // Step 2: Call Remotive API
            String response = restTemplate.getForObject(url, String.class);
            
            // Step 3: Parse and return jobs
            List<Map<String, Object>> jobs = parseRomotiveResponse(response, limit);
            
            log.info("✅ Got {} jobs from Remotive", jobs.size());
            return jobs;
            
        } catch (Exception e) {
            log.error("❌ Error fetching Remotive jobs: {}", e.getMessage());
            return new ArrayList<>(); // Return empty list on error
        }
    }
    
    /**
     * Fetch remote jobs from Jobicy API
     * 
     * ✅ JOBICY API DOCUMENTATION:
     *    Website: https://jobicy.com
     *    API Docs: https://jobicy.com/api/documentation
     *    Free: Yes, No authentication needed
     * 
     * @param geo Country code (e.g., IN, US)
     * @param industry Industry filter
     * @param limit Number of results
     * @return List of job listings
     */
    public List<Map<String, Object>> fetchJobicyJobs(String geo, String industry, int limit) {
        try {
            log.info("📡 Calling Jobicy API...");
            
            // Step 1: Build URL with parameters
            String url = JOBICY_API;
            List<String> params = new ArrayList<>();
            
            if (geo != null && !geo.isEmpty()) {
                params.add("country=" + geo);
            }
            if (industry != null && !industry.isEmpty()) {
                params.add("industry=" + industry);
            }
            if (!params.isEmpty()) {
                url += "?" + String.join("&", params);
            }
            
            // Step 2: Call Jobicy API
            String response = restTemplate.getForObject(url, String.class);
            
            // Step 3: Parse and return jobs
            List<Map<String, Object>> jobs = parseJobicyResponse(response, limit);
            
            log.info("✅ Got {} jobs from Jobicy", jobs.size());
            return jobs;
            
        } catch (Exception e) {
            log.error("❌ Error fetching Jobicy jobs: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch jobs from Adzuna API
     * 
     * ✅ ADZUNA API DOCUMENTATION:
     *    Website: https://www.adzuna.com/
     *    API Portal: https://developer.adzuna.com/
     *    Free: Yes, Requires free API registration
     *    Setup:
     *      1. Sign up at https://developer.adzuna.com/
     *      2. Create an app
     *      3. Get app_id and app_key
     *      4. Add to .env:
     *         ADZUNA_APP_ID=your_app_id
     *         ADZUNA_API_KEY=your_api_key
     * 
     * @param what Job title or keyword (REQUIRED)
     * @param where Location (optional)
     * @param limit Number of results
     * @return List of job listings
     */
    public List<Map<String, Object>> fetchAdzunaJobs(String what, String where, int limit) {
        try {
            log.info("📡 Calling Adzuna API with credentials...");
            
            // Step 1: Check if API credentials are set
            if (adzunaAppId == null || adzunaAppId.isEmpty()) {
                log.warn("⚠️ Adzuna API credentials not set. Add to .env: ADZUNA_APP_ID and ADZUNA_API_KEY");
                return new ArrayList<>();
            }
            
            // Step 2: Build URL with API credentials and parameters
            String url = ADZUNA_API + 
                        "?app_id=" + adzunaAppId + 
                        "&app_key=" + adzunaApiKey + 
                        "&what=" + what;
            
            if (where != null && !where.isEmpty()) {
                url += "&where=" + where;
            }
            
            url += "&results_per_page=" + limit;
            
            // Step 3: Call Adzuna API
            String response = restTemplate.getForObject(url, String.class);
            
            // Step 4: Parse and return jobs
            List<Map<String, Object>> jobs = parseAdzunaResponse(response, limit);
            
            log.info("✅ Got {} jobs from Adzuna", jobs.size());
            return jobs;
            
        } catch (Exception e) {
            log.error("❌ Error fetching Adzuna jobs: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    // ===== RESPONSE PARSERS =====
    // These methods parse the JSON responses from external APIs
    
    private List<Map<String, Object>> parseRomotiveResponse(String response, int limit) {
        try {
            // Parse Remotive API response and extract jobs
            // Remotive returns: { "results": [ { "id", "title", "company", "url", ... } ] }
            
            List<Map<String, Object>> jobs = new ArrayList<>();
            
            // TODO: Implement Remotive response parsing
            // This depends on Remotive API's exact response format
            // For now, return empty list
            
            return jobs.stream().limit(limit).toList();
            
        } catch (Exception e) {
            log.error("Error parsing Remotive response: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private List<Map<String, Object>> parseJobicyResponse(String response, int limit) {
        try {
            // Parse Jobicy API response and extract jobs
            // Jobicy returns: [ { "id", "title", "company", "url", "location", ... } ]
            
            List<Map<String, Object>> jobs = new ArrayList<>();
            
            // TODO: Implement Jobicy response parsing
            // This depends on Jobicy API's exact response format
            // For now, return empty list
            
            return jobs.stream().limit(limit).toList();
            
        } catch (Exception e) {
            log.error("Error parsing Jobicy response: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private List<Map<String, Object>> parseAdzunaResponse(String response, int limit) {
        try {
            // Parse Adzuna API response and extract jobs
            // Adzuna returns: { "results": [ { "id", "title", "company", "location", "salary_min", "salary_max", ... } ] }
            
            List<Map<String, Object>> jobs = new ArrayList<>();
            
            // TODO: Implement Adzuna response parsing
            // This depends on Adzuna API's exact response format
            // For now, return empty list
            
            return jobs.stream().limit(limit).toList();
            
        } catch (Exception e) {
            log.error("Error parsing Adzuna response: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}
