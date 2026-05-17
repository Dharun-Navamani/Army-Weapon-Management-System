package com.military.awms.service;

import com.military.awms.dto.request.LoginRequest;
import com.military.awms.dto.request.RegisterRequest;
import com.military.awms.dto.response.JwtResponse;
import com.military.awms.dto.response.TokenRefreshResponse;
import com.military.awms.exception.BadRequestException;
import com.military.awms.model.Role;
import com.military.awms.model.User;
import com.military.awms.repository.RoleRepository;
import com.military.awms.repository.UserRepository;
import com.military.awms.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Authentication service handling login, registration, and token refresh.
 * Uses Spring Security's AuthenticationManager for credential validation.
 */
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Authenticate user credentials and return JWT tokens.
     */
    public JwtResponse login(LoginRequest loginRequest) {
        // Authenticate using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT tokens
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Load user details for response
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .rankTitle(user.getRankTitle())
                .unit(user.getUnit())
                .roles(roles)
                .build();
    }

    /**
     * Register a new user with specified roles.
     */
    public User register(RegisterRequest request) {
        // Check for duplicate username and email
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }

        // Resolve roles
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
                roles.add(role);
            }
        } else {
            // Default to SOLDIER role
            Role soldierRole = roleRepository.findByName("ROLE_SOLDIER")
                    .orElseThrow(() -> new BadRequestException("Default role not found"));
            roles.add(soldierRole);
        }

        // Create and save user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .rankTitle(request.getRankTitle())
                .unit(request.getUnit())
                .roles(roles)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    /**
     * Refresh an expired access token using a valid refresh token.
     */
    public TokenRefreshResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newAccessToken = jwtTokenProvider.generateTokenFromUsername(
                username, 86400000); // 24 hours

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    /** Get all users (admin function) */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
