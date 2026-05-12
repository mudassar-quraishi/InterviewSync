package com.interviewsync.dto;

import com.interviewsync.entity.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingResponse {
    Long id;
    BookingStatus status;
    Long userId;
    String userName;
    String userEmail;
    Long interviewSlotId;
    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;
    boolean slotAvailable;
}