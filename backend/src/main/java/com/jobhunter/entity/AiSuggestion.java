package com.jobhunter.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ✅ FILE #2: NEW ENTITY - AiSuggestion
 * 
 * Purpose: Store AI-generated suggestions (cover letters, interview tips, etc)
 * Linked to: User, JobApplication
 * Database Table: ai_suggestions (already in schema.sql)
 * 
 * Used by:
 *   - /api/ai/cover-letter endpoint
 *   - /api/ai/interview-prep endpoint
 *   - /api/ai/salary-insights endpoint
 *   - /api/ai/insights endpoint
 */
@Entity
@Table(name = "ai_suggestions")
public class AiSuggestion {
    
    // ===== PRIMARY KEY =====
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    // ===== FOREIGN KEYS =====
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "job_application_id")
    private JobApplication jobApplication;
    
    // ===== DATA COLUMNS =====
    @Column(name = "suggestion_type", length = 100)
    private String suggestionType; // Examples: COVER_LETTER, INTERVIEW_PREP, SALARY_INSIGHTS, GENERAL_INSIGHTS
    
    @Column(name = "prompt_used", columnDefinition = "TEXT")
    private String promptUsed; // The prompt sent to Gemini AI
    
    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse; // The response from Gemini AI
    
    @Column(name = "model_used", length = 100)
    private String modelUsed = "gemini-1.5-pro"; // AI model version
    
    @Column(name = "tokens_used")
    private Integer tokensUsed; // Number of tokens used in API call
    
    @Column(name = "rating")
    private Integer rating; // User rating of the suggestion (1-5)
    
    // ===== TIMESTAMPS =====
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // ===== GETTERS AND SETTERS =====
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public JobApplication getJobApplication() { return jobApplication; }
    public void setJobApplication(JobApplication jobApplication) { this.jobApplication = jobApplication; }
    
    public String getSuggestionType() { return suggestionType; }
    public void setSuggestionType(String suggestionType) { this.suggestionType = suggestionType; }
    
    public String getPromptUsed() { return promptUsed; }
    public void setPromptUsed(String promptUsed) { this.promptUsed = promptUsed; }
    
    public String getAiResponse() { return aiResponse; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
    
    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
    
    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
