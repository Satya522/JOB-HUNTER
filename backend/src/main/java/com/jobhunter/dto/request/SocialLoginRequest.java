package com.jobhunter.dto.request;

import lombok.Data;

@Data
public class SocialLoginRequest {
    private String email;
    private String fullName;
    private String provider; // "GOOGLE", "GITHUB", "FACEBOOK"
    private String providerId;
    private String avatarUrl;
}