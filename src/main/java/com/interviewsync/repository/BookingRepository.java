package com.interviewsync.repository;

import com.interviewsync.entity.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByUserIdAndInterviewSlotId(Long userId, Long interviewSlotId);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByInterviewSlotId(Long interviewSlotId);
}