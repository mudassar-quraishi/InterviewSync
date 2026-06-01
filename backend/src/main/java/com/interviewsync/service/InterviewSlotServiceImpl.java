package com.interviewsync.service;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import com.interviewsync.entity.BookingStatus;
import com.interviewsync.entity.InterviewSlot;
import com.interviewsync.entity.User;
import com.interviewsync.exception.BusinessRuleException;
import com.interviewsync.exception.DuplicateResourceException;
import com.interviewsync.exception.ResourceNotFoundException;
import com.interviewsync.repository.BookingRepository;
import com.interviewsync.repository.InterviewSlotRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class InterviewSlotServiceImpl implements InterviewSlotService {

    private final InterviewSlotRepository interviewSlotRepository;
    private final BookingRepository bookingRepository;

    public InterviewSlotServiceImpl(InterviewSlotRepository interviewSlotRepository,
                                    BookingRepository bookingRepository) {
        this.interviewSlotRepository = interviewSlotRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public InterviewSlotResponse createSlot(InterviewSlotRequest request, User currentUser) {
        log.info("Creating interview slot for date: {} by HR: {}", request.getDate(), currentUser.getEmail());

        // Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BusinessRuleException("End time must be after start time");
        }

        // Check for overlapping slots
        List<InterviewSlot> overlapping = interviewSlotRepository.findOverlappingSlots(
                request.getDate(), request.getStartTime(), request.getEndTime());
        if (!overlapping.isEmpty()) {
            throw new DuplicateResourceException("An overlapping interview slot already exists for this time range");
        }

        InterviewSlot slot = InterviewSlot.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .interviewType(request.getInterviewType())
                .location(request.getLocation())
                .maxCandidates(request.getMaxCandidates())
                .bookedCount(0)
                .createdBy(currentUser)
                .build();

        slot = interviewSlotRepository.save(slot);
        log.info("Slot created with ID: {}", slot.getId());
        return toResponse(slot);
    }

    @Override
    public List<InterviewSlotResponse> getAllSlots() {
        log.debug("Fetching all interview slots");
        return interviewSlotRepository.findByOrderByDateAscStartTimeAsc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<InterviewSlotResponse> getAvailableSlots() {
        log.debug("Fetching available interview slots");
        return interviewSlotRepository.findAvailableSlots()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public InterviewSlotResponse getSlotById(Long slotId) {
        log.debug("Fetching slot by ID: {}", slotId);
        InterviewSlot slot = interviewSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview slot not found with ID: " + slotId));
        return toResponse(slot);
    }

    @Override
    public InterviewSlotResponse updateSlot(Long slotId, InterviewSlotRequest request) {
        log.info("Updating slot ID: {}", slotId);

        InterviewSlot slot = interviewSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview slot not found with ID: " + slotId));

        // Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BusinessRuleException("End time must be after start time");
        }

        // Check for overlapping slots (excluding this one)
        List<InterviewSlot> overlapping = interviewSlotRepository.findOverlappingSlotsExcluding(
                request.getDate(), request.getStartTime(), request.getEndTime(), slotId);
        if (!overlapping.isEmpty()) {
            throw new DuplicateResourceException("An overlapping interview slot already exists for this time range");
        }

        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setInterviewType(request.getInterviewType());
        slot.setLocation(request.getLocation());
        slot.setMaxCandidates(request.getMaxCandidates());

        slot = interviewSlotRepository.save(slot);
        log.info("Slot updated: {}", slot.getId());
        return toResponse(slot);
    }

    @Override
    public void deleteSlot(Long slotId) {
        log.info("Deleting slot ID: {}", slotId);

        InterviewSlot slot = interviewSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview slot not found with ID: " + slotId));

        // Check if there are any completed bookings
        boolean hasCompleted = bookingRepository.findByInterviewSlotId(slotId).stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.COMPLETED);

        if (hasCompleted) {
            throw new BusinessRuleException("Cannot delete a slot with completed interviews");
        }

        interviewSlotRepository.delete(slot);
        log.info("Slot deleted: {}", slotId);
    }

    @Override
    public long countAllSlots() {
        return interviewSlotRepository.count();
    }

    private InterviewSlotResponse toResponse(InterviewSlot slot) {
        return InterviewSlotResponse.builder()
                .id(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .interviewType(slot.getInterviewType())
                .location(slot.getLocation())
                .maxCandidates(slot.getMaxCandidates())
                .bookedCount(slot.getBookedCount())
                .availableSeats(slot.getMaxCandidates() - slot.getBookedCount())
                .createdById(slot.getCreatedBy().getId())
                .createdByName(slot.getCreatedBy().getFullName())
                .build();
    }
}