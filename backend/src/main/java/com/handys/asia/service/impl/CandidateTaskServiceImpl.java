package com.handys.asia.service.impl;

import com.handys.asia.api.controller.request.CreateOrUpdateCandidateTaskRequest;
import com.handys.asia.api.controller.response.CandidateTaskResponse;
import com.handys.asia.converter.CandidateTaskConverter;
import com.handys.asia.entity.CandidateTask;
import com.handys.asia.entity.Task;
import com.handys.asia.exception.InvalidCandidateException;
import com.handys.asia.exception.ResourceNotFoundException;
import com.handys.asia.repository.CandidateTaskRepository;
import com.handys.asia.repository.TaskRepository;
import com.handys.asia.service.CandidateTaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class CandidateTaskServiceImpl implements CandidateTaskService {
    private final CandidateTaskRepository repository;
    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public CandidateTaskResponse create(CreateOrUpdateCandidateTaskRequest request) {
        if (request == null) {
            return null;
        }

        Task task = getTask(request.getTaskId());
        validateEmailDuplicate(request.getEmail());

        CandidateTask candidateTask = repository.save(CandidateTaskConverter.toCandidateTask(request, task));

        return CandidateTaskConverter.toCandidateTaskResponse(candidateTask);
    }

    @Override
    @Transactional
    public CandidateTaskResponse update(UUID uuid, CreateOrUpdateCandidateTaskRequest request) {
        if (uuid == null || request == null) {
            return null;
        }

        CandidateTask candidateTask = repository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Candidate Task id %s not found", uuid)));

        Task task = getTask(request.getTaskId());
        updateCandidateTask(candidateTask, task, request);

        return CandidateTaskConverter.toCandidateTaskResponse(repository.save(candidateTask));
    }

    @Override
    public List<CandidateTaskResponse> findAll() {
        return repository.findAllByOrderByUpdatedAtDesc().stream().map(CandidateTaskConverter::toCandidateTaskResponse).toList();
    }

    @Override
    public CandidateTaskResponse findById(UUID uuid) {
        return repository.findById(uuid)
                .map(CandidateTaskConverter::toCandidateTaskResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", uuid)));
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        CandidateTask task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
        repository.delete(task);
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
    }

    void validateEmailDuplicate(String email) {
        if(repository.existsByEmail(email)) {
            throw new InvalidCandidateException(String.format("User email %s already exists", email));
        }
    }

    void updateCandidateTask(CandidateTask candidateTask, Task task, CreateOrUpdateCandidateTaskRequest request) {
        candidateTask.setFirstName(request.getFirstName());
        candidateTask.setLastName(request.getLastName());
        candidateTask.setTask(task);
        candidateTask.setDuration(request.getDuration());
        candidateTask.setExtraTime(request.getExtraTime());
        candidateTask.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
    }
}
