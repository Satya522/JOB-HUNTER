package com.jobhunter.controller;

import com.jobhunter.dto.request.JobApplicationRequest;
import com.jobhunter.dto.response.JobApplicationResponse;
import com.jobhunter.enums.JobStatus;
import com.jobhunter.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getAllJobs(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(jobService.getAllJobs(status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getJobById(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createJob(@Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateJob(
            @PathVariable UUID id,
            @Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable UUID id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam JobStatus status) {
        return ResponseEntity.ok(jobService.updateStatus(id, status));
    }

    @GetMapping("/stats/overview")
    public ResponseEntity<Object> getStatsOverview() {
        return ResponseEntity.ok(jobService.getStatsOverview());
    }
}
