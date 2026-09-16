package com.jobhunter.service;

import com.jobhunter.dto.request.JobApplicationRequest;
import com.jobhunter.dto.response.JobApplicationResponse;
import com.jobhunter.entity.JobApplication;
import com.jobhunter.entity.User;
import com.jobhunter.enums.JobStatus;
import com.jobhunter.repository.JobApplicationRepository;
import com.jobhunter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobApplicationRepository jobRepository;
    private final UserRepository userRepository;

    public List<JobApplicationResponse> getAllJobs(JobStatus status, String search) {
        List<JobApplication> jobs;
        UUID userId = getCurrentUserId();
        
        if (status != null) {
            jobs = jobRepository.findByUserIdAndStatus(userId, status);
        } else if (search != null && !search.isEmpty()) {
            jobs = jobRepository.searchByUserId(userId, search);
        } else {
            jobs = jobRepository.findByUserId(userId);
        }
        
        return jobs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobApplicationResponse getJobById(UUID id) {
        JobApplication job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found"));
        return mapToResponse(job);
    }

    public JobApplicationResponse createJob(JobApplicationRequest request) {
        User user = getCurrentUser();
        
        JobApplication job = JobApplication.builder()
                .user(user)  // Fixed: Set user object instead of userId
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .jobUrl(request.getJobUrl())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.APPLIED)
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .roleType(request.getRoleType())
                .matchPercentage(request.getMatchPercentage())
                .appliedDate(request.getAppliedDate())
                .notes(request.getNotes())
                .source(request.getSource())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .coverLetter(false)
                .build();
        
        JobApplication saved = jobRepository.save(job);
        return mapToResponse(saved);
    }

    public JobApplicationResponse updateJob(UUID id, JobApplicationRequest request) {
        JobApplication job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found"));
        
        job.setCompanyName(request.getCompanyName());
        job.setJobTitle(request.getJobTitle());
        job.setJobUrl(request.getJobUrl());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setRoleType(request.getRoleType());
        job.setMatchPercentage(request.getMatchPercentage());
        job.setAppliedDate(request.getAppliedDate());
        job.setNotes(request.getNotes());
        job.setSource(request.getSource());
        if (request.getPriority() != null) {
            job.setPriority(request.getPriority());
        }
        
        JobApplication updated = jobRepository.save(job);
        return mapToResponse(updated);
    }

    public void deleteJob(UUID id) {
        jobRepository.deleteById(id);
    }

    public JobApplicationResponse updateStatus(UUID id, JobStatus status) {
        JobApplication job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found"));
        job.setStatus(status);
        JobApplication updated = jobRepository.save(job);
        return mapToResponse(updated);
    }

    public Map<String, Object> getStatsOverview() {
        UUID userId = getCurrentUserId();
        Map<String, Object> stats = new HashMap<>();
        
        long total = jobRepository.countByUserId(userId);
        long applied = jobRepository.countByUserIdAndStatus(userId, JobStatus.APPLIED);
        long interviews = jobRepository.countByUserIdAndStatus(userId, JobStatus.INTERVIEW);
        long offers = jobRepository.countByUserIdAndStatus(userId, JobStatus.OFFER);
        long rejected = jobRepository.countByUserIdAndStatus(userId, JobStatus.REJECTED);
        
        stats.put("totalApplications", total);
        stats.put("applied", applied);
        stats.put("interviews", interviews);
        stats.put("offers", offers);
        stats.put("rejected", rejected);
        stats.put("responseRate", total > 0 ? Math.round((interviews + offers) * 100.0 / total) : 0);
        
        return stats;
    }

    private JobApplicationResponse mapToResponse(JobApplication job) {
    return JobApplicationResponse.builder()
        .id(job.getId())
        .companyName(job.getCompanyName())
        .jobTitle(job.getJobTitle())
        .status(job.getStatus())
        .salaryMin(job.getSalaryMin())
        .salaryMax(job.getSalaryMax())
        .location(job.getLocation())
        .appliedDate(job.getAppliedDate())
        // ✅ REMOVED: .responseDate(job.getResponseDate()) - removed to fix error
        .build();
    }

    /**
     * Get current user ID from SecurityContext
     */
    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                return userRepository.findByEmail(email)
                        .map(user -> user.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
            }
        }
        throw new RuntimeException("User not authenticated");
    }

    /**
     * Get current user entity from SecurityContext
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                return userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
            }
        }
        throw new RuntimeException("User not authenticated");
    }
}
