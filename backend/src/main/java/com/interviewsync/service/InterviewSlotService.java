package com.interviewsync.service;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import java.util.List;

public interface InterviewSlotService {

	InterviewSlotResponse createSlot(InterviewSlotRequest request);

	List<InterviewSlotResponse> getAllSlots();

	InterviewSlotResponse updateAvailability(Long slotId, boolean available);
}
