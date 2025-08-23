package com.handys.asia.converter;

import com.handys.asia.api.controller.request.CreateOrUpdateCandidateTaskRequest;
import com.handys.asia.api.controller.response.CandidateTaskResponse;
import com.handys.asia.entity.CandidateTask;
import com.handys.asia.entity.Task;

public class CandidateTaskConverter {
    public static CandidateTaskResponse toCandidateTaskResponse(CandidateTask candidate) {
        if (candidate == null) {
            return null;
        }

        return CandidateTaskResponse.builder()
                .uuid(candidate.getId())
                .email(candidate.getEmail())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .duration(candidate.getDuration())
                .extraTime(candidate.getExtraTime())
                .taskId(candidate.getTask().getId())
                .taskName(candidate.getTask().getTaskName())
                .submissionLink(candidate.getSubmissionLink())
                .createdBy(candidate.getCreatedBy())
//                .createdAt(LocalTimeConverter.toLocalTime(candidate.getCreatedAt().getTime()))
//                .updatedAt(LocalTimeConverter.toLocalTime(candidate.getUpdatedAt().getTime()))
                .build();
    }

    public static CandidateTask toCandidateTask(CreateOrUpdateCandidateTaskRequest request, Task task) {
        if (request == null) {
            return null;
        }

        return CandidateTask.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .duration(request.getDuration())
                .extraTime(request.getExtraTime())
                .task(task)
                .build();
    }
}
