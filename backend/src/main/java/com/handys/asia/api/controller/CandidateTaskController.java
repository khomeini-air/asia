package com.handys.asia.api.controller;

import com.handys.asia.api.controller.request.CreateOrUpdateCandidateTaskRequest;
import com.handys.asia.api.controller.response.CandidateTaskResponse;
import com.handys.asia.service.CandidateTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidateTask")
@RequiredArgsConstructor
public class CandidateTaskController {
    private final CandidateTaskService service;

    @GetMapping
    public ResponseEntity<List<CandidateTaskResponse>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll());
    }

    @PostMapping
    public ResponseEntity<CandidateTaskResponse> create(@RequestBody @Valid CreateOrUpdateCandidateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(service.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateTaskResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateTaskResponse> updateById(@PathVariable UUID id, @RequestBody CreateOrUpdateCandidateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
