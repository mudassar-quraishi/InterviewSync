package com.interviewsync.service;

import com.interviewsync.dto.BookingResponse;
import com.interviewsync.dto.CreateBookingRequest;
import com.interviewsync.entity.User;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, User currentUser);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getMyBookings(Long userId);

    BookingResponse getBookingById(Long bookingId);

    void cancelBooking(Long bookingId, User currentUser);

    BookingResponse acceptBooking(Long bookingId);

    BookingResponse rejectBooking(Long bookingId);

    BookingResponse completeBooking(Long bookingId);

    long countByStatus(String status);
}