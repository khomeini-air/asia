package com.handys.asia.service;

import com.handys.asia.api.controller.request.CreateOrUpdateCandidateTaskRequest;
import com.handys.asia.api.controller.request.SubmitTaskRequest;
import com.handys.asia.api.controller.response.CandidateTaskResponse;

import java.util.List;
import java.util.UUID;

public interface CandidateTaskService {
    CandidateTaskResponse create(CreateOrUpdateCandidateTaskRequest request);
    List<CandidateTaskResponse> findAll();
    CandidateTaskResponse findById(UUID uuid);
    CandidateTaskResponse update(UUID uuid, CreateOrUpdateCandidateTaskRequest candidateTask);
    void deleteById(UUID id);
    void startTaskById(UUID id);
    void submitTaskById(UUID id, SubmitTaskRequest request);
}
