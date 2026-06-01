package com.interviewsync.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Interview slot ID is required")
    private Long interviewSlotId;
}