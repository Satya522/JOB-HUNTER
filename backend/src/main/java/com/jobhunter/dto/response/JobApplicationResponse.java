package com.jobhunter.dto.response;

import com.jobhunter.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {

    private UUID id;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private JobStatus status;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String jobType;
    private Integer matchPercentage;
    private LocalDate appliedDate;
    private String notes;
    private String source;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
