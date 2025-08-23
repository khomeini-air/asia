package com.handys.asia.repository;

import com.handys.asia.entity.CandidateTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CandidateTaskRepository  extends JpaRepository<CandidateTask, UUID> {
    List<CandidateTask> findAllByOrderByUpdatedAtDesc();
    boolean existsByEmail(String email);
}
