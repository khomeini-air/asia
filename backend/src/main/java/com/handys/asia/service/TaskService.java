package com.handys.asia.service;

import com.handys.asia.api.controller.request.CreateOrUpdateTaskRequest;
import com.handys.asia.api.controller.response.TaskResponse;

import java.util.List;

public interface TaskService {
    TaskResponse create(CreateOrUpdateTaskRequest task);
    TaskResponse update(Long id, CreateOrUpdateTaskRequest task);
    List<TaskResponse> findAll();
    TaskResponse findById(Long id);
    void deleteById(Long id);
}
