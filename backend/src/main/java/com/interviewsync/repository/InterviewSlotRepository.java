package com.interviewsync.repository;

import com.interviewsync.entity.InterviewSlot;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {

    List<InterviewSlot> findByOrderByDateAscStartTimeAsc();

    @Query("SELECT s FROM InterviewSlot s WHERE s.bookedCount < s.maxCandidates ORDER BY s.date ASC, s.startTime ASC")
    List<InterviewSlot> findAvailableSlots();

    @Query("SELECT s FROM InterviewSlot s WHERE s.date = :date " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    List<InterviewSlot> findOverlappingSlots(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    @Query("SELECT s FROM InterviewSlot s WHERE s.date = :date " +
           "AND s.startTime < :endTime AND s.endTime > :startTime AND s.id <> :excludeId")
    List<InterviewSlot> findOverlappingSlotsExcluding(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);

    List<InterviewSlot> findByCreatedById(Long userId);
}
