package com.handys.asia.repository;

import com.handys.asia.entity.CandidateTask;
import com.handys.asia.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateTaskRepository  extends JpaRepository<CandidateTask, Long> {
}
