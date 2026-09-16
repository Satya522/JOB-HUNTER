package com.jobhunter.entity;

import com.jobhunter.enums.JobStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "job_title", nullable = false, length = 200)
    private String jobTitle;

    @Column(name = "job_url", length = 1000)
    private String jobUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private JobStatus status = JobStatus.APPLIED;

    @Column(name = "salary_min")
    private Integer salaryMin;

    @Column(name = "salary_max")
    private Integer salaryMax;

    @Column(length = 200)
    private String location;

    @Column(name = "job_type", length = 50)
    private String jobType;

    @Column(name = "role_type", length = 50)
    private String roleType;

    @Column(name = "match_percentage")
    private Integer matchPercentage;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @Column(name = "response_date")
    private LocalDate responseDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "resume_version", length = 100)
    private String resumeVersion;

    @Column(name = "cover_letter")
    @Builder.Default
    private Boolean coverLetter = false;

    @Column(length = 100)
    private String source;

    @Column(name = "contact_name", length = 200)
    private String contactName;

    @Column(name = "contact_email", length = 200)
    private String contactEmail;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(length = 20)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(name = "kanban_order")
    @Builder.Default
    private Integer kanbanOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
