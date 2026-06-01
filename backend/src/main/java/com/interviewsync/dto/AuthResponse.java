package com.interviewsync.dto;

import com.interviewsync.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private String companyName;
    private String token;
}
