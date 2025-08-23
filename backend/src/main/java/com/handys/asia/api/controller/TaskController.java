package com.handys.asia.api.controller;

import com.handys.asia.api.controller.request.CreateOrUpdateTaskRequest;
import com.handys.asia.api.controller.response.TaskResponse;
import com.handys.asia.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.findAll());
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@RequestBody @Valid CreateOrUpdateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateById(@PathVariable Long id, @RequestBody @Valid CreateOrUpdateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        taskService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
