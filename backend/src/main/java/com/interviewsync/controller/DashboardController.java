package com.interviewsync.controller;

import com.interviewsync.service.BookingService;
import com.interviewsync.service.InterviewSlotService;
import com.interviewsync.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dashboard analytics")
public class DashboardController {

    private final InterviewSlotService slotService;
    private final BookingService bookingService;
    private final UserService userService;

    public DashboardController(InterviewSlotService slotService,
                               BookingService bookingService,
                               UserService userService) {
        this.slotService = slotService;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard stats", description = "Get analytics for HR dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSlots", slotService.countAllSlots());
        stats.put("totalCandidates", userService.countCandidates());
        stats.put("pendingInterviews", bookingService.countByStatus("PENDING"));
        stats.put("acceptedInterviews", bookingService.countByStatus("ACCEPTED"));
        stats.put("completedInterviews", bookingService.countByStatus("COMPLETED"));
        stats.put("rejectedInterviews", bookingService.countByStatus("REJECTED"));
        return ResponseEntity.ok(stats);
    }
}
