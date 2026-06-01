package com.interviewsync.dto;

import com.interviewsync.entity.InterviewType;
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
    InterviewType interviewType;
    String location;
    int maxCandidates;
    int bookedCount;
    int availableSeats;
    Long createdById;
    String createdByName;
}