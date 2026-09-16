package com.jobhunter.service;

import com.jobhunter.dto.request.LoginRequest;
import com.jobhunter.dto.request.RegisterRequest;
import com.jobhunter.dto.request.SocialLoginRequest; 
import com.jobhunter.dto.response.AuthResponse;
import com.jobhunter.entity.User;
import com.jobhunter.enums.AuthProvider; 
import com.jobhunter.repository.UserRepository;
import com.jobhunter.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    // --- 1. REGISTER METHOD ---
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .location(request.getLocation())
                .provider(AuthProvider.LOCAL) // <-- YEH LINE ADD KI HAI (Taki DB ko pata chale ye manual signup hai)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(), savedUser.getPasswordHash(), java.util.Collections.emptyList()
        ));

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .message("Registration successful")
                .build();
    }

    // --- 2. LOGIN METHOD ---
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .message("Login successful")
                .build();
    }

    // --- 3. REFRESH TOKEN METHOD ---
    public AuthResponse refreshToken(String token) {
        String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String newToken = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(newToken)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .message("Token refreshed")
                .build();
    }

    // --- 4. FORGOT PASSWORD METHOD ---
    public void forgotPassword(String email) {
        // Implementation for password reset
        log.info("Password reset requested for: {}", email);
    }

    // --- 5. SOCIAL LOGIN METHOD ---
    public AuthResponse processSocialLogin(SocialLoginRequest request) {
        log.info("Processing social login for email: {}", request.getEmail());
        
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            log.info("Existing user found. Logging in via social provider.");
        } else {
            // Naya user banayein
            log.info("New user. Registering via social provider.");
            user = User.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .avatarUrl(request.getAvatarUrl())
                    .providerId(request.getProviderId())
                    .isActive(true)
                    .passwordHash("") // Social login mein password empty hota hai
                    .build();

            // Provider (Enum) set karein
            try {
                user.setProvider(AuthProvider.valueOf(request.getProvider().toUpperCase()));
            } catch (IllegalArgumentException | NullPointerException e) {
                user.setProvider(AuthProvider.LOCAL); // Default fallback
            }

            user = userRepository.save(user);
        }

        // Token generation
        String dummyPassword = user.getPasswordHash() != null ? user.getPasswordHash() : "";
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), dummyPassword, java.util.Collections.emptyList()
        ));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .message("Social login successful")
                .build();
    }
}