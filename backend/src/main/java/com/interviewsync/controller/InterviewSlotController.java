package com.interviewsync.controller;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import com.interviewsync.entity.User;
import com.interviewsync.service.InterviewSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slots")
@Tag(name = "Interview Slots", description = "Manage interview slots")
public class InterviewSlotController {

    private final InterviewSlotService interviewSlotService;

    public InterviewSlotController(InterviewSlotService interviewSlotService) {
        this.interviewSlotService = interviewSlotService;
    }

    @PostMapping
    @Operation(summary = "Create interview slot", description = "HR creates a new interview slot")
    public ResponseEntity<InterviewSlotResponse> createSlot(
            @Valid @RequestBody InterviewSlotRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interviewSlotService.createSlot(request, currentUser));
    }

    @GetMapping
    @Operation(summary = "Get all slots", description = "List all interview slots")
    public ResponseEntity<List<InterviewSlotResponse>> getAllSlots(
            @RequestParam(required = false) Boolean available) {
        if (Boolean.TRUE.equals(available)) {
            return ResponseEntity.ok(interviewSlotService.getAvailableSlots());
        }
        return ResponseEntity.ok(interviewSlotService.getAllSlots());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get slot by ID", description = "Get a single interview slot by ID")
    public ResponseEntity<InterviewSlotResponse> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewSlotService.getSlotById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update slot", description = "HR updates an existing interview slot")
    public ResponseEntity<InterviewSlotResponse> updateSlot(
            @PathVariable Long id,
            @Valid @RequestBody InterviewSlotRequest request) {
        return ResponseEntity.ok(interviewSlotService.updateSlot(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete slot", description = "HR deletes an interview slot (cannot delete completed)")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        interviewSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
