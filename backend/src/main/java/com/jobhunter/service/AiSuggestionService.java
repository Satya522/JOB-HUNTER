package com.jobhunter.service;

import com.jobhunter.entity.AiSuggestion;
import com.jobhunter.entity.User;
import com.jobhunter.repository.AiSuggestionRepository;
import com.jobhunter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.Data; 
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * ✅ FILE #9: AiSuggestionService
 * * Purpose: Generate AI suggestions using Gemini AI
 * Used by: AiController
 * Depends on: GeminiAiService (FILE #5)
 * * Methods:
 * - generateCoverLetter()
 * - getInterviewPrep()
 * - getSalaryInsights()
 * - getGeneralInsights()
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiSuggestionService {
    
    // ===== DEPENDENCIES =====
    private final AiSuggestionRepository aiSuggestionRepository;
    private final UserRepository userRepository;
    private final GeminiAiService geminiAiService; // FILE #5: Calls Gemini API
    
    /**
     * Generate a professional cover letter using Gemini AI
     * * @param request CoverLetterRequest with job details
     * @param userEmail Email of the user
     * @return AiSuggestion with generated cover letter
     */
    public AiSuggestion generateCoverLetter(Object request, String userEmail) {
        log.info("🤖 Generating cover letter for user: {}", userEmail);
        
        // Step 1: Get user
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Step 2: Build prompt for Gemini AI
        String prompt = buildCoverLetterPrompt((CoverLetterRequest) request);
        
        // Step 3: Call Gemini AI (FILE #5)
        String response = geminiAiService.generateContent(prompt);
        
        // Step 4: Create AiSuggestion entity
        AiSuggestion suggestion = new AiSuggestion();
        suggestion.setUser(user);
        suggestion.setSuggestionType("COVER_LETTER");
        suggestion.setPromptUsed(prompt);
        suggestion.setAiResponse(response);
        suggestion.setModelUsed("gemini-1.5-pro");
        suggestion.setCreatedAt(LocalDateTime.now());
        
        // Step 5: Save to database
        AiSuggestion saved = aiSuggestionRepository.save(suggestion);
        log.info("✅ Cover letter saved: {}", saved.getId());
        
        return saved;
    }
    
    /**
     * Get interview preparation tips using Gemini AI
     */
    public AiSuggestion getInterviewPrep(Object request, String userEmail) {
        log.info("🤖 Generating interview prep for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String prompt = buildInterviewPrepPrompt((InterviewPrepRequest) request);
        String response = geminiAiService.generateContent(prompt);
        
        AiSuggestion suggestion = new AiSuggestion();
        suggestion.setUser(user);
        suggestion.setSuggestionType("INTERVIEW_PREP");
        suggestion.setPromptUsed(prompt);
        suggestion.setAiResponse(response);
        suggestion.setModelUsed("gemini-1.5-pro");
        suggestion.setCreatedAt(LocalDateTime.now());
        
        return aiSuggestionRepository.save(suggestion);
    }
    
    /**
     * Get salary insights using Gemini AI
     */
    public AiSuggestion getSalaryInsights(Object request, String userEmail) {
        log.info("🤖 Generating salary insights for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String prompt = buildSalaryInsightsPrompt((SalaryInsightsRequest) request);
        String response = geminiAiService.generateContent(prompt);
        
        AiSuggestion suggestion = new AiSuggestion();
        suggestion.setUser(user);
        suggestion.setSuggestionType("SALARY_INSIGHTS");
        suggestion.setPromptUsed(prompt);
        suggestion.setAiResponse(response);
        suggestion.setModelUsed("gemini-1.5-pro");
        suggestion.setCreatedAt(LocalDateTime.now());
        
        return aiSuggestionRepository.save(suggestion);
    }
    
    /**
     * Get general career insights using Gemini AI
     */
    public AiSuggestion getGeneralInsights(String userEmail) {
        log.info("🤖 Generating general insights for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String prompt = "Provide personalized career and job search insights for " + user.getFullName() + 
                       " based on their job hunting journey. Include tips on resume improvement, " +
                       "interview preparation, and job search strategy.";
        
        String response = geminiAiService.generateContent(prompt);
        
        AiSuggestion suggestion = new AiSuggestion();
        suggestion.setUser(user);
        suggestion.setSuggestionType("GENERAL_INSIGHTS");
        suggestion.setPromptUsed(prompt);
        suggestion.setAiResponse(response);
        suggestion.setModelUsed("gemini-1.5-pro");
        suggestion.setCreatedAt(LocalDateTime.now());
        
        return aiSuggestionRepository.save(suggestion);
    }
    
    // ===== PROMPT BUILDERS =====
    // These methods build the prompts that will be sent to Gemini AI
    
    private String buildCoverLetterPrompt(CoverLetterRequest request) {
        return String.format(
            "Write a professional and compelling cover letter for the position of %s at %s. " +
            "Include relevant experience and skills. " +
            "Resume summary: %s. " +
            "Job description: %s. " +
            "Make it specific to the company and role, showing genuine interest in the position.",
            request.getJobTitle(), request.getCompany(), 
            request.getResumeSummary(), request.getJobDescription()
        );
    }
    
    private String buildInterviewPrepPrompt(InterviewPrepRequest request) {
        return String.format(
            "Provide comprehensive interview preparation tips for the role of %s at %s. " +
            "Include: " +
            "1. Common interview questions for this role " +
            "2. Tips for answering behavioral questions " +
            "3. Questions to ask the interviewer " +
            "4. Tips to stand out " +
            "5. Company-specific insights if known about %s",
            request.getJobTitle(), request.getCompany(), request.getCompany()
        );
    }
    
    private String buildSalaryInsightsPrompt(SalaryInsightsRequest request) {
        return String.format(
            "Provide detailed salary insights for a %s position in %s with %d years of experience. " +
            "Include: " +
            "1. Expected salary range " +
            "2. Market trends " +
            "3. Salary negotiation tips " +
            "4. Factors that affect salary in this location " +
            "5. Ways to increase earning potential",
            request.getTitle(), request.getLocation(), request.getYearsExp()
        );
    }
}


// ✅ YEH NAYA AUR SAHI CODE HAI (Neeche diya gaya hai)


@Data
class CoverLetterRequest {
    public String jobTitle;
    public String company;
    public String resumeSummary;
    public String jobDescription;
}

@Data
class InterviewPrepRequest {
    public String jobTitle;
    public String company;
}

@Data
class SalaryInsightsRequest {
    public String title;
    public String location;
    public Integer yearsExp;
}