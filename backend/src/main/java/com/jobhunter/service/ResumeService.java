package com.jobhunter.service;

import com.jobhunter.entity.Resume;
import com.jobhunter.entity.User;
import com.jobhunter.repository.ResumeRepository;
import com.jobhunter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * ✅ FILE #6: ResumeService
 * 
 * Purpose: Handle resume upload and management
 * Used by: ResumesController
 * 
 * Endpoints:
 *   - POST /api/resumes/upload (upload new resume)
 *   - GET /api/resumes (get user's resumes)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    
    // ===== DEPENDENCIES =====
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    
    // ===== CONFIGURATION =====
    @Value("${file.upload.dir:uploads/resumes/}")
    private String uploadDir;
    
    @Value("${file.upload.max-size:5242880}")
    private long maxFileSize;
    
    /**
     * Upload a new resume file
     * 
     * @param file The resume file (PDF or DOCX)
     * @param versionName Name for this resume version (optional)
     * @param userEmail Email of the user uploading
     * @return Saved Resume entity
     */
    public Resume uploadResume(MultipartFile file, String versionName, String userEmail) {
        try {
            log.info("📄 Uploading resume for user: {}", userEmail);
            
            // Step 1: Validate file
            validateFile(file);
            
            // Step 2: Get user from database
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Step 3: Create upload directory if not exists
            Files.createDirectories(Paths.get(uploadDir));
            
            // Step 4: Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = Paths.get(uploadDir + fileName);
            
            // Step 5: Save file to disk
            Files.write(filePath, file.getBytes());
            log.info("✅ File saved to: {}", filePath);
            
            // Step 6: Create Resume entity
            Resume resume = new Resume();
            resume.setUser(user);
            resume.setFileName(originalFilename);
            resume.setFileUrl("/uploads/resumes/" + fileName);
            resume.setFileSize(file.getSize());  // ✅ FIXED: Already Long, no casting needed
            resume.setVersionName(versionName != null ? versionName : "v1");
            resume.setIsPrimary(false);
            // ✅ REMOVED: resume.setUploadedAt() - handled by @CreationTimestamp in Entity
            
            // Step 7: Save to database
            Resume savedResume = resumeRepository.save(resume);
            log.info("✅ Resume saved to database with ID: {}", savedResume.getId());
            
            return savedResume;
            
        } catch (IOException e) {
            log.error("❌ File upload failed: {}", e.getMessage());
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Validate uploaded file
     * - Check if file is not empty
     * - Check file size (max 5MB)
     * - Check file type (PDF or DOCX only)
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds " + (maxFileSize / 1024 / 1024) + "MB limit");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || 
            (!contentType.equals("application/pdf") && 
             !contentType.contains("wordprocessingml"))) {
            throw new RuntimeException("Only PDF and DOCX files are allowed");
        }
    }
    
    /**
     * Get all resumes for a user
     */
    public List<Resume> getUserResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Resume> resumes = resumeRepository.findByUserId(user.getId());
        log.info("📄 Found {} resumes for user: {}", resumes.size(), userEmail);
        
        return resumes;
    }
}
