// package com.jobhunter.controller;

// import com.jobhunter.dto.request.LoginRequest;
// import com.jobhunter.dto.request.RegisterRequest;
// import com.jobhunter.dto.response.AuthResponse;
// import com.jobhunter.service.AuthService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class AuthController {

//     private final AuthService authService;

//     @PostMapping("/register")
//     public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
//         return ResponseEntity.ok(authService.register(request));
//     }

//     @PostMapping("/login")
//     public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
//         return ResponseEntity.ok(authService.login(request));
//     }

//     @PostMapping("/refresh")
//     public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String token) {
//         return ResponseEntity.ok(authService.refreshToken(token));
//     }

//     @PostMapping("/forgot-password")
//     public ResponseEntity<String> forgotPassword(@RequestParam String email) {
//         authService.forgotPassword(email);
//         return ResponseEntity.ok("Password reset link sent to your email");
//     }
// }

package com.jobhunter.controller;

import com.jobhunter.dto.request.LoginRequest;
import com.jobhunter.dto.request.RegisterRequest;
import com.jobhunter.dto.request.SocialLoginRequest; // Naya import
import com.jobhunter.dto.response.AuthResponse;
import com.jobhunter.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // --- NAYA ENDPOINT SOCIAL LOGIN KE LIYE ---
    @PostMapping("/social-login")
    public ResponseEntity<AuthResponse> socialLogin(@RequestBody SocialLoginRequest request) {
        // Yeh wahi AuthResponse return karega jo normal login karta hai
        return ResponseEntity.ok(authService.processSocialLogin(request));
    }
    // ------------------------------------------

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.refreshToken(token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok("Password reset link sent to your email");
    }
}
