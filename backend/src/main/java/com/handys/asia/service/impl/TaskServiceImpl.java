package com.handys.asia.service.impl;

import com.handys.asia.api.controller.request.CreateOrUpdateTaskRequest;
import com.handys.asia.api.controller.response.TaskResponse;
import com.handys.asia.converter.TaskConverter;
import com.handys.asia.entity.Task;
import com.handys.asia.exception.ResourceNotFoundException;
import com.handys.asia.repository.TaskRepository;
import com.handys.asia.service.TaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public TaskResponse create(CreateOrUpdateTaskRequest taskRequest) {
        if (taskRequest == null) {
            return null;
        }

        Task task = taskRepository.save(TaskConverter.toTask(taskRequest));

        return TaskConverter.toTaskResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse update(Long id, CreateOrUpdateTaskRequest taskRequest) {
        if (id == null || taskRequest == null) {
            return null;
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));

        task.setTitle(taskRequest.getTitle());
        task.setTaskName(taskRequest.getTaskName());
        task.setDescription(taskRequest.getDescription());
        task.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return TaskConverter.toTaskResponse(taskRepository.save(task));
    }

    @Override
    public List<TaskResponse> findAll() {
        return taskRepository.findAllByOrderByUpdatedAtDesc().stream().map(TaskConverter::toTaskResponse).toList();
    }

    @Override
    public TaskResponse findById(Long id) {
        return taskRepository.findById(id)
                .map(TaskConverter::toTaskResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
        taskRepository.delete(task);
    }
}
