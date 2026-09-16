package com.jobhunter.repository;

import com.jobhunter.entity.AtsAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * ✅ FILE #3: AtsAnalysisRepository
 * 
 * Purpose: Database queries for AtsAnalysis entity
 * Used by: AtsService
 * Methods: findByUserId, findByResumeId
 */
@Repository
public interface AtsAnalysisRepository extends JpaRepository<AtsAnalysis, String> {
    
    // Find all analyses for a specific user
    List<AtsAnalysis> findByUserId(UUID userId);
    
    // Find all analyses for a specific resume
    List<AtsAnalysis> findByResumeId(UUID resumeId);
}
