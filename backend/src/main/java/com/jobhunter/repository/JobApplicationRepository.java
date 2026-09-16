package com.jobhunter.repository;

import com.jobhunter.entity.JobApplication;
import com.jobhunter.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    // Fixed: Changed j.userId to j.user.id
    List<JobApplication> findByUserId(UUID userId);

    List<JobApplication> findByUserIdAndStatus(UUID userId, JobStatus status);

    @Query("SELECT j FROM JobApplication j WHERE j.user.id = :userId AND " +
           "(LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<JobApplication> searchByUserId(@Param("userId") UUID userId, @Param("search") String search);

    @Query("SELECT j.status, COUNT(j) FROM JobApplication j WHERE j.user.id = :userId GROUP BY j.status")
    List<Object[]> countByStatusGrouped(@Param("userId") UUID userId);

    long countByUserIdAndStatus(UUID userId, JobStatus status);

    // Fixed: Added missing method
    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);
}
