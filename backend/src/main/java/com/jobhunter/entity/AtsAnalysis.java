package com.jobhunter.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ✅ FILE #1: NEW ENTITY - AtsAnalysis
 * 
 * Purpose: Store resume vs job description analysis results
 * Linked to: User, Resume
 * Database Table: ats_analyses (already in schema.sql)
 * 
 * Used by: /api/ats/analyze endpoint
 */
@Entity
@Table(name = "ats_analyses")
public class AtsAnalysis {
    
    // ===== PRIMARY KEY =====
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    // ===== FOREIGN KEYS =====
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
    
    // ===== DATA COLUMNS =====
    @Column(name = "job_title", length = 200)
    private String jobTitle;
    
    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;
    
    @Column(name = "match_percentage")
    private Integer matchPercentage;
    
    @Column(name = "matching_keywords", columnDefinition = "TEXT[]")
    private String[] matchingKeywords;
    
    @Column(name = "missing_keywords", columnDefinition = "TEXT[]")
    private String[] missingKeywords;
    
    @Column(name = "suggestions", columnDefinition = "TEXT[]")
    private String[] suggestions;
    
    @Column(name = "ats_score")
    private Integer atsScore;
    
    // ===== TIMESTAMPS =====
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // ===== GETTERS AND SETTERS =====
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    
    public Integer getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Integer matchPercentage) { this.matchPercentage = matchPercentage; }
    
    public String[] getMatchingKeywords() { return matchingKeywords; }
    public void setMatchingKeywords(String[] matchingKeywords) { this.matchingKeywords = matchingKeywords; }
    
    public String[] getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(String[] missingKeywords) { this.missingKeywords = missingKeywords; }
    
    public String[] getSuggestions() { return suggestions; }
    public void setSuggestions(String[] suggestions) { this.suggestions = suggestions; }
    
    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
