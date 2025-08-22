package com.handys.asia.controller;

import com.handys.asia.entity.CandidateTask;
import com.handys.asia.repository.CandidateTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidateTask")
@RequiredArgsConstructor
public class CandidateTaskController {
    private CandidateTaskRepository repository;

    @GetMapping
    public List<CandidateTask> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public CandidateTask createTask(@RequestBody CandidateTask task) {
        return repository.save(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateTask> getTaskById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateTask> updateTask(@PathVariable Long id, @RequestBody CandidateTask taskDetails) {
        return repository.findById(id)
                .map(candidateTask -> {
                    candidateTask.setEmail(taskDetails.getEmail());
                    candidateTask.setFirstName(taskDetails.getFirstName());
                    candidateTask.setLastName(taskDetails.getLastName());
                    candidateTask.setTask(taskDetails.getTask());
                    candidateTask.setDuration(taskDetails.getDuration());
                    candidateTask.setExtraTime(taskDetails.getExtraTime());
                    CandidateTask updatedTask = repository.save(candidateTask);
                    return ResponseEntity.ok(updatedTask);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return repository.findById(id)
                .map(task -> {
                    repository.delete(task);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
