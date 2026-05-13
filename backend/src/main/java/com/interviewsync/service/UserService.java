package com.interviewsync.service;

import com.interviewsync.dto.AuthResponse;
import com.interviewsync.dto.LoginRequest;
import com.interviewsync.dto.SignupRequest;

public interface UserService {

	AuthResponse signup(SignupRequest request);

	AuthResponse login(LoginRequest request);
}
