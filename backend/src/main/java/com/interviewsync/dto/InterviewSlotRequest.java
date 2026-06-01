package com.interviewsync.dto;

import com.interviewsync.entity.InterviewType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;

@Data
public class InterviewSlotRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    private String location;

    @NotNull(message = "Maximum candidates is required")
    @Min(value = 1, message = "At least 1 candidate must be allowed")
    private Integer maxCandidates;
}