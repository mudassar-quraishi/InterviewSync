package com.interviewsync.service;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import com.interviewsync.entity.InterviewSlot;
import com.interviewsync.repository.InterviewSlotRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class InterviewSlotServiceImpl implements InterviewSlotService {

    private final InterviewSlotRepository interviewSlotRepository;

    public InterviewSlotServiceImpl(InterviewSlotRepository interviewSlotRepository) {
        this.interviewSlotRepository = interviewSlotRepository;
    }

    @Override
    public InterviewSlotResponse createSlot(InterviewSlotRequest request) {
        InterviewSlot slot = InterviewSlot.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .available(request.getAvailable() == null || request.getAvailable())
                .build();
        return toResponse(interviewSlotRepository.save(slot));
    }

    @Override
    public List<InterviewSlotResponse> getAllSlots() {
        return interviewSlotRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public InterviewSlotResponse updateAvailability(Long slotId, boolean available) {
        InterviewSlot slot = interviewSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview slot not found"));
        slot.setAvailable(available);
        return toResponse(interviewSlotRepository.save(slot));
    }

    private InterviewSlotResponse toResponse(InterviewSlot slot) {
        return InterviewSlotResponse.builder()
                .id(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .available(slot.isAvailable())
                .build();
    }
}