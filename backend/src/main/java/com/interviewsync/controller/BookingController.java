package com.interviewsync.controller;

import com.interviewsync.dto.BookingResponse;
import com.interviewsync.dto.CreateBookingRequest;
import com.interviewsync.entity.User;
import com.interviewsync.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Manage interview bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create booking", description = "Candidate books an available interview slot")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request, currentUser));
    }

    @GetMapping
    @Operation(summary = "Get all bookings", description = "HR gets all bookings, Candidate gets own bookings")
    public ResponseEntity<List<BookingResponse>> getBookings(
            @AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole().name().equals("HR")) {
            return ResponseEntity.ok(bookingService.getAllBookings());
        }
        return ResponseEntity.ok(bookingService.getMyBookings(currentUser.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Get a single booking by ID")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel booking", description = "Candidate cancels booking before interview date")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        bookingService.cancelBooking(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept candidate", description = "HR accepts a candidate booking")
    public ResponseEntity<BookingResponse> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject candidate", description = "HR rejects a candidate booking")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark interview completed", description = "HR marks interview as completed")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id));
    }
}