package com.interviewsync.service;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import com.interviewsync.entity.User;
import java.util.List;

public interface InterviewSlotService {

    InterviewSlotResponse createSlot(InterviewSlotRequest request, User currentUser);

    List<InterviewSlotResponse> getAllSlots();

    List<InterviewSlotResponse> getAvailableSlots();

    InterviewSlotResponse getSlotById(Long slotId);

    InterviewSlotResponse updateSlot(Long slotId, InterviewSlotRequest request);

    void deleteSlot(Long slotId);

    long countAllSlots();
}
