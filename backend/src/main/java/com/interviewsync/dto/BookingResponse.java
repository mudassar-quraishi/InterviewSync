package com.interviewsync.dto;

import com.interviewsync.entity.BookingStatus;
import com.interviewsync.entity.InterviewType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingResponse {
    Long id;
    BookingStatus status;
    LocalDateTime bookingDate;
    Long userId;
    String userName;
    String userEmail;
    Long interviewSlotId;
    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;
    InterviewType interviewType;
    String location;
}