// package com.jobhunter.entity;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// import org.hibernate.annotations.CreationTimestamp;
// import org.hibernate.annotations.UpdateTimestamp;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.UUID;

// @Entity
// @Table(name = "users")
// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.UUID)
//     private UUID id;

//     @Column(name = "full_name", nullable = false, length = 100)
//     private String fullName;

//     @Column(unique = true, length = 100)
//     private String email;

//     @Column(length = 20)
//     private String phone;

//     @Column(name = "password_hash", nullable = false, length = 255)
//     private String passwordHash;

//     @Column(name = "avatar_url", length = 500)
//     private String avatarUrl;

//     @Column(name = "github_username", length = 100)
//     private String githubUsername;

//     @Column(name = "linkedin_url", length = 500)
//     private String linkedinUrl;

//     @Column(name = "leetcode_username", length = 100)
//     private String leetcodeUsername;

//     @Column(name = "gfg_username", length = 100)
//     private String gfgUsername;

//     @Column(name = "cn_username", length = 100)
//     private String cnUsername;

//     @Column(length = 200)
//     private String location;

//     @Column(name = "preferred_roles")
//     private String preferredRoles;  // Changed from List<String> to String (JSON in DB)

//     @Column(name = "preferred_locs")
//     private String preferredLocations;  // Changed from List<String> to String (JSON in DB)

//     @Column(name = "is_active")
//     @Builder.Default
//     private Boolean isActive = true;

//     @CreationTimestamp
//     @Column(name = "created_at")
//     private LocalDateTime createdAt;

//     @UpdateTimestamp
//     @Column(name = "updated_at")
//     private LocalDateTime updatedAt;

//     @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//     private List<JobApplication> jobApplications;

//     @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//     private List<Resume> resumes;
// }


package com.jobhunter.entity;

import com.jobhunter.enums.AuthProvider; // Apne AuthProvider ka import add kiya
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    // Email hamesha honi chahiye, isliye nullable = false add karna safe hai
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    // IMPORTANT CHANGE: nullable = false hata diya gaya hai social login ke liye
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    // --- SOCIAL LOGIN FIELDS START ---
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL; // Default LOCAL rahega

    @Column(name = "provider_id", length = 255)
    private String providerId; // Google ya GitHub ka unique user ID yahan aayega

    // --- SOCIAL LOGIN FIELDS END ---

    @Column(name = "github_username", length = 100)
    private String githubUsername;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "leetcode_username", length = 100)
    private String leetcodeUsername;

    @Column(name = "gfg_username", length = 100)
    private String gfgUsername;

    @Column(name = "cn_username", length = 100)
    private String cnUsername;

    @Column(length = 200)
    private String location;

    @Column(name = "preferred_roles")
    private String preferredRoles;  // JSON in DB

    @Column(name = "preferred_locs")
    private String preferredLocations;  // JSON in DB

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false) // updatable = false add karna best practice hai
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobApplication> jobApplications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resume> resumes;
}