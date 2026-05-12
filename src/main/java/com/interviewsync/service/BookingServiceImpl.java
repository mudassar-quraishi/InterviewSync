package com.interviewsync.service;

import com.interviewsync.dto.BookingResponse;
import com.interviewsync.dto.CreateBookingRequest;
import com.interviewsync.dto.UpdateBookingStatusRequest;
import com.interviewsync.entity.Booking;
import com.interviewsync.entity.BookingStatus;
import com.interviewsync.entity.InterviewSlot;
import com.interviewsync.entity.Role;
import com.interviewsync.entity.User;
import com.interviewsync.repository.BookingRepository;
import com.interviewsync.repository.InterviewSlotRepository;
import com.interviewsync.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final InterviewSlotRepository interviewSlotRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            InterviewSlotRepository interviewSlotRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.interviewSlotRepository = interviewSlotRepository;
    }

    @Override
    public BookingResponse createBooking(CreateBookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.CANDIDATE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only candidates can book slots");
        }

        InterviewSlot slot = interviewSlotRepository.findById(request.getInterviewSlotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview slot not found"));

        if (!slot.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview slot is not available");
        }

        if (bookingRepository.existsByUserIdAndInterviewSlotId(user.getId(), slot.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Duplicate booking is not allowed");
        }

        Booking booking = Booking.builder()
                .status(BookingStatus.PENDING)
                .user(user)
                .interviewSlot(slot)
                .build();

        slot.setAvailable(false);
        interviewSlotRepository.save(slot);

        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Override
    public BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        booking.setStatus(request.getStatus());
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        InterviewSlot slot = booking.getInterviewSlot();
        User user = booking.getUser();
        return BookingResponse.builder()
                .id(booking.getId())
                .status(booking.getStatus())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .interviewSlotId(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .slotAvailable(slot.isAvailable())
                .build();
    }
}