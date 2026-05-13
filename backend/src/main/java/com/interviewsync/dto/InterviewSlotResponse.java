package com.interviewsync.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class InterviewSlotResponse {
    Long id;
    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;
    boolean available;
}