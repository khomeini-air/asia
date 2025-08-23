package com.handys.asia.converter;

import com.handys.asia.api.controller.request.CreateOrUpdateTaskRequest;
import com.handys.asia.api.controller.response.TaskResponse;
import com.handys.asia.entity.Task;

public class TaskConverter {
    public static TaskResponse toTaskResponse(Task task) {
        if (task == null) {
            return null;
        }

        return TaskResponse.builder()
                .id(task.getId())
                .taskName(task.getTaskName())
                .title(task.getTitle())
                .description(task.getDescription())
                .createdBy(task.getCreatedBy())
                .createdAt(LocalTimeConverter.toLocalTime(task.getCreatedAt().getTime()))
                .updatedAt(LocalTimeConverter.toLocalTime(task.getUpdatedAt().getTime())).
                build();
    }

    public static Task toTask(CreateOrUpdateTaskRequest request) {
        if (request == null) {
            return null;
        }

        return Task.builder()
                .taskName(request.getTaskName())
                .description(request.getDescription())
                .title(request.getTitle())
                .build();
    }
}
