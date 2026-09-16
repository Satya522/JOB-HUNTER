package com.jobhunter.controller;

import com.jobhunter.entity.AiSuggestion;
import com.jobhunter.service.AiSuggestionService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


/**
 * ✅ FILE #8: AiController
 * 
 * Purpose: Handle AI suggestion endpoints (cover letters, interview prep, etc)
 * Base URL: /api/ai
 * 
 * Endpoints:
 *   - POST /api/ai/cover-letter - Generate cover letter
 *   - POST /api/ai/interview-prep - Get interview preparation tips
 *   - POST /api/ai/salary-insights - Get salary insights
 *   - POST /api/ai/insights - Get general career insights
 * 
 * Uses: Google Gemini AI API (https://ai.google.dev)
 * Used by: AiController in frontend
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {
    
    // ===== DEPENDENCIES =====
    private final AiSuggestionService aiSuggestionService;
    
    /**
     * POST /api/ai/cover-letter
     * 
     * Generate a professional cover letter using AI
     * 
     * Request Body:
     *   {
     *     "jobTitle": "Senior Engineer",
     *     "company": "Google",
     *     "resumeSummary": "10 years of experience...",
     *     "jobDescription": "We are looking for..."
     *   }
     * 
     * Response: 201 Created
     *   AiSuggestion object with generated cover letter
     * 
     * Example:
     *   curl -X POST http://localhost:8080/api/ai/cover-letter \
     *     -H "Authorization: Bearer {token}" \
     *     -H "Content-Type: application/json" \
     *     -d '{"jobTitle":"Senior Engineer",...}'
     */
    @PostMapping("/cover-letter")
    public ResponseEntity<AiSuggestion> generateCoverLetter(
            @RequestBody CoverLetterRequest request,
            Authentication authentication) {
        
        log.info("📝 Cover letter generation requested for: {}", request.getCompany());
        
        String userEmail = authentication.getName();
        AiSuggestion suggestion = aiSuggestionService.generateCoverLetter(request, userEmail);
        
        log.info("✅ Cover letter generated: {}", suggestion.getId());
        
        return ResponseEntity.status(201).body(suggestion);
    }
    
    /**
     * POST /api/ai/interview-prep
     * 
     * Get interview preparation tips and common questions
     * 
     * Request Body:
     *   {
     *     "jobTitle": "Senior Engineer",
     *     "company": "Google"
     *   }
     * 
     * Response: 201 Created
     *   AiSuggestion object with interview tips
     */
    @PostMapping("/interview-prep")
    public ResponseEntity<AiSuggestion> getInterviewPrep(
            @RequestBody InterviewPrepRequest request,
            Authentication authentication) {
        
        log.info("🎤 Interview prep requested for: {} at {}", request.getJobTitle(), request.getCompany());
        
        String userEmail = authentication.getName();
        AiSuggestion suggestion = aiSuggestionService.getInterviewPrep(request, userEmail);
        
        return ResponseEntity.status(201).body(suggestion);
    }
    
    /**
     * POST /api/ai/salary-insights
     * 
     * Get salary insights for a specific role and location
     * 
     * Request Body:
     *   {
     *     "title": "Senior Engineer",
     *     "location": "San Francisco",
     *     "yearsExp": 5
     *   }
     * 
     * Response: 201 Created
     *   AiSuggestion object with salary insights
     */
    @PostMapping("/salary-insights")
    public ResponseEntity<AiSuggestion> getSalaryInsights(
            @RequestBody SalaryInsightsRequest request,
            Authentication authentication) {
        
        log.info("💰 Salary insights requested for: {}", request.getTitle());
        
        String userEmail = authentication.getName();
        AiSuggestion suggestion = aiSuggestionService.getSalaryInsights(request, userEmail);
        
        return ResponseEntity.status(201).body(suggestion);
    }
    
    /**
     * POST /api/ai/insights
     * 
     * Get general career and job search insights based on user's profile
     * 
     * Request: No body required
     * 
     * Response: 201 Created
     *   AiSuggestion object with personalized insights
     */
    @PostMapping("/insights")
    public ResponseEntity<AiSuggestion> getGeneralInsights(Authentication authentication) {
        
        log.info("🎯 General insights requested");
        
        String userEmail = authentication.getName();
        AiSuggestion suggestion = aiSuggestionService.getGeneralInsights(userEmail);
        
        return ResponseEntity.status(201).body(suggestion);
    }
}

/**
 * ===== REQUEST DTOs =====
 * 
 * These classes represent the request body for AI endpoints
 * They are used to parse and validate incoming JSON requests
 */

@Data 

class CoverLetterRequest{
    private String jobTitle;
    private String company;
    private String resumeSummary;
    private String jobDescription;
}

@Data

class InterviewPrepRequest{
    private String jobTitle;
    private String company;

}

@Data

class SalaryInsightsRequest{
    private String title;
    private String location;
    private Integer yearExp;
}

