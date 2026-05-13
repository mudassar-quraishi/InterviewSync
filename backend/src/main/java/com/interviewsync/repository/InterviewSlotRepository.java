package com.interviewsync.repository;

import com.interviewsync.entity.InterviewSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {

	List<InterviewSlot> findByAvailableTrueOrderByDateAscStartTimeAsc();
}
