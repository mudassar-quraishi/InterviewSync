package com.interviewsync.repository;

import com.interviewsync.entity.Booking;
import com.interviewsync.entity.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByUserIdAndInterviewSlotId(Long userId, Long interviewSlotId);

    boolean existsByUserIdAndStatusIn(Long userId, List<BookingStatus> statuses);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByInterviewSlotId(Long interviewSlotId);

    long countByStatus(BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);
}