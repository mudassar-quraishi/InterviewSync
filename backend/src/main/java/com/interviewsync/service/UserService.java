package com.interviewsync.service;

import com.interviewsync.dto.AuthResponse;
import com.interviewsync.dto.LoginRequest;
import com.interviewsync.dto.SignupRequest;
import java.util.List;

public interface UserService {

    AuthResponse register(SignupRequest request);

    AuthResponse login(LoginRequest request);

    List<AuthResponse> getAllCandidates();

    long countCandidates();

    void deleteCandidate(Long id);
}
