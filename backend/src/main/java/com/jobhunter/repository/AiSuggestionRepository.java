package com.jobhunter.repository;

import com.jobhunter.entity.AiSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID; // ✅ Yahan UUID import kiya gaya hai

/**
 * ✅ FILE #4: AiSuggestionRepository
 * * Purpose: Database queries for AiSuggestion entity
 * Used by: AiSuggestionService
 * Methods: findByUserId, findByJobApplicationId, findBySuggestionType
 */
@Repository
public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, String> {
    
    // ✅ Ye humne already theek kar diya tha
    List<AiSuggestion> findByUserId(UUID userId);
    
    // ✅ YAHAN CHANGE KIYA: String ko UUID kar diya
    List<AiSuggestion> findByJobApplicationId(UUID jobApplicationId);
    
    // Find all suggestions of a specific type (COVER_LETTER, INTERVIEW_PREP, etc)
    List<AiSuggestion> findBySuggestionType(String suggestionType);
}