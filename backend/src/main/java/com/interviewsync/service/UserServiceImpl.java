package com.interviewsync.service;

import com.interviewsync.dto.AuthResponse;
import com.interviewsync.dto.LoginRequest;
import com.interviewsync.dto.SignupRequest;
import com.interviewsync.entity.Booking;
import com.interviewsync.entity.BookingStatus;
import com.interviewsync.entity.InterviewSlot;
import com.interviewsync.entity.Role;
import com.interviewsync.entity.User;
import com.interviewsync.exception.BusinessRuleException;
import com.interviewsync.exception.DuplicateResourceException;
import com.interviewsync.exception.ResourceNotFoundException;
import com.interviewsync.repository.BookingRepository;
import com.interviewsync.repository.InterviewSlotRepository;
import com.interviewsync.repository.UserRepository;
import com.interviewsync.security.JwtService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BookingRepository bookingRepository;
    private final InterviewSlotRepository interviewSlotRepository;

    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           BookingRepository bookingRepository,
                           InterviewSlotRepository interviewSlotRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.bookingRepository = bookingRepository;
        this.interviewSlotRepository = interviewSlotRepository;
    }

    @Override
    public AuthResponse register(SignupRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role. Must be HR or CANDIDATE");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .companyName(request.getCompanyName())
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {} with role: {}", user.getEmail(), user.getRole());

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return toAuthResponse(user, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        log.info("User logged in successfully: {}", user.getEmail());

        return toAuthResponse(user, token);
    }

    @Override
    public List<AuthResponse> getAllCandidates() {
        log.debug("Fetching all candidates");
        return userRepository.findByRole(Role.CANDIDATE).stream()
                .map(u -> toAuthResponse(u, null))
                .toList();
    }

    @Override
    public long countCandidates() {
        return userRepository.countByRole(Role.CANDIDATE);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .companyName(user.getCompanyName())
                .token(token)
                .build();
    }

    @Override
    @Transactional
    public void deleteCandidate(Long id) {
        log.info("Deleting candidate user ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + id));

        if (user.getRole() != Role.CANDIDATE) {
            throw new BusinessRuleException("Only candidate accounts can be deleted");
        }

        // Find bookings and cleanup slot bookedCount
        List<Booking> bookings = bookingRepository.findByUserId(id);
        for (Booking booking : bookings) {
            if (booking.getStatus() != BookingStatus.REJECTED) {
                InterviewSlot slot = booking.getInterviewSlot();
                slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
                interviewSlotRepository.save(slot);
            }
        }

        // Delete bookings
        bookingRepository.deleteAll(bookings);

        // Delete the user
        userRepository.delete(user);
        log.info("Candidate user ID: {} deleted successfully", id);
    }
}
