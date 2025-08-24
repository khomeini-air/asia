package com.handys.asia.service.impl;

import com.handys.asia.api.controller.request.CreateOrUpdateCandidateTaskRequest;
import com.handys.asia.api.controller.request.SubmitTaskRequest;
import com.handys.asia.api.controller.response.CandidateTaskResponse;
import com.handys.asia.converter.CandidateTaskConverter;
import com.handys.asia.entity.CandidateTask;
import com.handys.asia.entity.Task;
import com.handys.asia.enums.TaskStatus;
import com.handys.asia.exception.InvalidCandidateException;
import com.handys.asia.exception.ResourceNotFoundException;
import com.handys.asia.exception.TaskExpiryException;
import com.handys.asia.repository.CandidateTaskRepository;
import com.handys.asia.repository.TaskRepository;
import com.handys.asia.service.CandidateTaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

        CandidateTask candidateTask = CandidateTaskConverter.toCandidateTask(request, task);
        candidateTask.setStatus(TaskStatus.CREATED);
        candidateTask = repository.save(candidateTask);

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
        CandidateTask candidateTask = getCandidateTask(uuid);
        return CandidateTaskConverter.toCandidateTaskResponse(candidateTask);
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        CandidateTask task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
        repository.delete(task);
    }

    @Override
    @Transactional
    public void startTaskById(UUID id) {
        CandidateTask candidateTask = getCandidateTask(id);

        validateExpiryTask(candidateTask);

        candidateTask.setStartedAt(Instant.now());
        candidateTask.setStatus(TaskStatus.CANDIDATE_STARTED);
        repository.save(candidateTask);
    }

    @Override
    @Transactional
    public void submitTaskById(UUID id, SubmitTaskRequest request) {
        CandidateTask candidateTask = getCandidateTask(id);

        validateExpiryTask(candidateTask);

        candidateTask.setSubmittedAt(Instant.ofEpochMilli(request.getSubmittedAt()));
        candidateTask.setStatus(TaskStatus.CANDIDATE_COMPLETED);
        repository.save(candidateTask);
    }

    private CandidateTask getCandidateTask(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task id %s not found", id)));
    }

    private void validateEmailDuplicate(String email) {
        if(repository.existsByEmail(email)) {
            throw new InvalidCandidateException(String.format("User email %s already exists", email));
        }
    }

    private void updateCandidateTask(CandidateTask candidateTask, Task task, CreateOrUpdateCandidateTaskRequest request) {
        candidateTask.setFirstName(request.getFirstName());
        candidateTask.setLastName(request.getLastName());
        candidateTask.setTask(task);
        candidateTask.setDuration(request.getDuration());
        candidateTask.setExtraTime(request.getExtraTime());
        candidateTask.setUpdatedAt(Instant.now());
    }

    private void validateExpiryTask(CandidateTask candidateTask) {
        if (candidateTask == null || candidateTask.getStartedAt() == null) {
            return;
        }

        Long duration = candidateTask.getDuration();
        Long extra = candidateTask.getExtraTime();
        Instant deadline = candidateTask.getStartedAt().plus(duration + extra, ChronoUnit.MINUTES);

        if(Instant.now().isAfter(deadline)) {
            throw new TaskExpiryException(String.format("Task %s has expired", candidateTask.getId()));
        }
    }
}
