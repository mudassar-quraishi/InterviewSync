package com.interviewsync.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long interviewSlotId;
}