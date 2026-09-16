package com.jobhunter.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID; // ✅ Ye import zaroori hai

@Entity
@Table(name = "resumes")
@Data  // ✅ Must have this for auto getters/setters
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; // ✅ String ko hatakar UUID kar diya
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_url")  // ✅ Must be file_url
    private String fileUrl;
    
    @Column(name = "file_size")
    private Long fileSize;  // ✅ Must be Long, NOT int
    
    @Column(name = "version_name")
    private String versionName;
    
    @Column(name = "is_primary")  // ✅ Must be is_primary
    private Boolean isPrimary;
    
    @CreationTimestamp  // ✅ Auto-sets timestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}