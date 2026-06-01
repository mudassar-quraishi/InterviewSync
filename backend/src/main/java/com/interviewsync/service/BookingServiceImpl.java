package com.interviewsync.service;

import com.interviewsync.dto.BookingResponse;
import com.interviewsync.dto.CreateBookingRequest;
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
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final InterviewSlotRepository interviewSlotRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              InterviewSlotRepository interviewSlotRepository) {
        this.bookingRepository = bookingRepository;
        this.interviewSlotRepository = interviewSlotRepository;
    }

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, User user) {
        log.info("Creating booking for user: {} on slot: {}", user.getEmail(), request.getInterviewSlotId());

        if (user.getRole() != Role.CANDIDATE) {
            throw new BusinessRuleException("Only candidates can book interview slots");
        }

        InterviewSlot slot = interviewSlotRepository.findById(request.getInterviewSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview slot not found"));

        // Check seat availability
        if (slot.getBookedCount() >= slot.getMaxCandidates()) {
            throw new BusinessRuleException("No available seats in this interview slot");
        }

        // Prevent duplicate booking on same slot
        if (bookingRepository.existsByUserIdAndInterviewSlotId(user.getId(), slot.getId())) {
            throw new DuplicateResourceException("You have already booked this interview slot");
        }

        // Prevent booking two active slots simultaneously
        List<BookingStatus> activeStatuses = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);
        if (bookingRepository.existsByUserIdAndStatusIn(user.getId(), activeStatuses)) {
            throw new BusinessRuleException("You already have an active interview booking. Cancel it before booking another");
        }

        Booking booking = Booking.builder()
                .status(BookingStatus.PENDING)
                .user(user)
                .interviewSlot(slot)
                .build();

        // Increment booked count
        slot.setBookedCount(slot.getBookedCount() + 1);
        interviewSlotRepository.save(slot);

        booking = bookingRepository.save(booking);
        log.info("Booking created with ID: {} for user: {}", booking.getId(), user.getEmail());
        return toResponse(booking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        log.debug("Fetching all bookings");
        return bookingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<BookingResponse> getMyBookings(Long userId) {
        log.debug("Fetching bookings for user: {}", userId);
        return bookingRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        log.debug("Fetching booking by ID: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return toResponse(booking);
    }

    @Override
    public void cancelBooking(Long bookingId, User currentUser) {
        log.info("Cancelling booking ID: {} by user: {}", bookingId, currentUser.getEmail());

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        // Only the booking owner can cancel
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new BusinessRuleException("You can only cancel your own bookings");
        }

        // Cannot cancel completed bookings
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BusinessRuleException("Cannot cancel a completed interview");
        }

        // Must cancel before interview date
        if (!booking.getInterviewSlot().getDate().isAfter(LocalDate.now())) {
            throw new BusinessRuleException("Cannot cancel booking on or after the interview date");
        }

        // Decrement booked count
        InterviewSlot slot = booking.getInterviewSlot();
        slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
        interviewSlotRepository.save(slot);

        bookingRepository.delete(booking);
        log.info("Booking cancelled: {}", bookingId);
    }

    @Override
    public BookingResponse acceptBooking(Long bookingId) {
        log.info("Accepting booking ID: {}", bookingId);
        return updateStatus(bookingId, BookingStatus.ACCEPTED);
    }

    @Override
    public BookingResponse rejectBooking(Long bookingId) {
        log.info("Rejecting booking ID: {}", bookingId);
        BookingResponse response = updateStatus(bookingId, BookingStatus.REJECTED);

        // Decrement booked count on rejection
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        InterviewSlot slot = booking.getInterviewSlot();
        slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
        interviewSlotRepository.save(slot);

        return response;
    }

    @Override
    public BookingResponse completeBooking(Long bookingId) {
        log.info("Completing booking ID: {}", bookingId);
        return updateStatus(bookingId, BookingStatus.COMPLETED);
    }

    @Override
    public long countByStatus(String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            return bookingRepository.countByStatus(bookingStatus);
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    private BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);
        log.info("Booking {} status updated to: {}", bookingId, newStatus);
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        InterviewSlot slot = booking.getInterviewSlot();
        User user = booking.getUser();
        return BookingResponse.builder()
                .id(booking.getId())
                .status(booking.getStatus())
                .bookingDate(booking.getBookingDate())
                .userId(user.getId())
                .userName(user.getFullName())
                .userEmail(user.getEmail())
                .interviewSlotId(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .interviewType(slot.getInterviewType())
                .location(slot.getLocation())
                .build();
    }
}