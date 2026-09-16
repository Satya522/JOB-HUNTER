package com.jobhunter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String refreshToken;
    private UUID userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String message;
}
