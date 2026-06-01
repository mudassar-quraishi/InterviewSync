package com.interviewsync.controller;

import com.interviewsync.dto.AuthResponse;
import com.interviewsync.dto.LoginRequest;
import com.interviewsync.dto.SignupRequest;
import com.interviewsync.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration and login")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new HR or Candidate account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and receive JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/candidates")
    @Operation(summary = "List all candidates", description = "Get all registered candidates (HR only)")
    public ResponseEntity<List<AuthResponse>> getAllCandidates() {
        return ResponseEntity.ok(userService.getAllCandidates());
    }

    @DeleteMapping("/candidates/{id}")
    @Operation(summary = "Delete a candidate", description = "Delete a registered candidate and cleanup their bookings (HR only)")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        userService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}
