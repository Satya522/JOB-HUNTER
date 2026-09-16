package com.jobhunter.dto.request;

import com.jobhunter.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String jobUrl;
    private JobStatus status = JobStatus.APPLIED;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String jobType;
    private String roleType;
    private Integer matchPercentage;
    private LocalDate appliedDate;
    private String notes;
    private String source;
    private String priority = "MEDIUM";
}
