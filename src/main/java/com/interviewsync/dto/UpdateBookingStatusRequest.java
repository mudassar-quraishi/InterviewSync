package com.interviewsync.dto;

import com.interviewsync.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {

    @NotNull
    private BookingStatus status;
}