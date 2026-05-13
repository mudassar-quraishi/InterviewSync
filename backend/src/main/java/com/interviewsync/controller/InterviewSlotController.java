package com.interviewsync.controller;

import com.interviewsync.dto.InterviewSlotRequest;
import com.interviewsync.dto.InterviewSlotResponse;
import com.interviewsync.service.InterviewSlotService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class InterviewSlotController {

	private final InterviewSlotService interviewSlotService;

	public InterviewSlotController(InterviewSlotService interviewSlotService) {
		this.interviewSlotService = interviewSlotService;
	}

	@PostMapping
	public ResponseEntity<InterviewSlotResponse> createSlot(@Valid @RequestBody InterviewSlotRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(interviewSlotService.createSlot(request));
	}

	@GetMapping
	public ResponseEntity<List<InterviewSlotResponse>> getAllSlots() {
		return ResponseEntity.ok(interviewSlotService.getAllSlots());
	}

	@PutMapping("/{id}/availability")
	public ResponseEntity<InterviewSlotResponse> updateAvailability(
			@PathVariable Long id,
			@RequestParam boolean available) {
		return ResponseEntity.ok(interviewSlotService.updateAvailability(id, available));
	}
}
