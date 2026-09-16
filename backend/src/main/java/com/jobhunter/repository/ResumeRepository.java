package com.jobhunter.repository;

import com.jobhunter.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {

    List<Resume> findByUserId(UUID userId);

    Optional<Resume> findByUserIdAndIsPrimary(UUID userId, Boolean isPrimary);

    @Query("SELECT r FROM Resume r WHERE r.user.id = :userId ORDER BY r.uploadedAt DESC")
    List<Resume> findAllByUserIdOrderByVersionDesc(@Param("userId") UUID userId);

    @Query("SELECT COUNT(r) FROM Resume r WHERE r.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    Optional<Resume> findByIdAndUserId(UUID id, UUID userId);
}
