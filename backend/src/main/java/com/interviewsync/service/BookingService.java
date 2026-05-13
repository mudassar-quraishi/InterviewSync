package com.interviewsync.service;

import com.interviewsync.dto.BookingResponse;
import com.interviewsync.dto.CreateBookingRequest;
import com.interviewsync.dto.UpdateBookingStatusRequest;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request);

    List<BookingResponse> getMyBookings(Long userId);

    BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request);
}