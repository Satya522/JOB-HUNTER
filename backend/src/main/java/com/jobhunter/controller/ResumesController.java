package com.jobhunter.controller;

import com.jobhunter.entity.Resume;
import com.jobhunter.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * ✅ FILE #7: ResumesController
 * 
 * Purpose: Handle resume upload and retrieval endpoints
 * Base URL: /api/resumes
 * 
 * Endpoints:
 *   - POST /api/resumes/upload - Upload a new resume
 *   - GET /api/resumes - Get all user's resumes
 * 
 * Used by: Frontend ResumesController (calls these endpoints)
 */
@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
public class ResumesController {
    
    // ===== DEPENDENCIES =====
    private final ResumeService resumeService;
    
    /**
     * POST /api/resumes/upload
     * 
     * Upload a new resume file
     * 
     * Request:
     *   - file: MultipartFile (PDF or DOCX, max 5MB)
     *   - versionName: String (optional, default "v1")
     * 
     * Response: 201 Created
     *   Resume object with file details
     * 
     * Example:
     *   curl -X POST http://localhost:8080/api/resumes/upload \
     *     -H "Authorization: Bearer {token}" \
     *     -F "file=@resume.pdf" \
     *     -F "versionName=v1"
     */
    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String versionName,
            Authentication authentication) {
        
        log.info("📤 Resume upload request received");
        
        String userEmail = authentication.getName();
        Resume resume = resumeService.uploadResume(file, versionName, userEmail);
        
        log.info("✅ Resume uploaded successfully: {}", resume.getId());
        
        return ResponseEntity.status(201).body(resume);
    }
    
    /**
     * GET /api/resumes
     * 
     * Get all resumes for the current user
     * 
     * Response: 200 OK
     *   List of Resume objects
     * 
     * Example:
     *   curl -X GET http://localhost:8080/api/resumes \
     *     -H "Authorization: Bearer {token}"
     */
    @GetMapping
    public ResponseEntity<List<Resume>> getUserResumes(Authentication authentication) {
        log.info("📄 Getting resumes for user");
        
        String userEmail = authentication.getName();
        List<Resume> resumes = resumeService.getUserResumes(userEmail);
        
        return ResponseEntity.ok(resumes);
    }
}
