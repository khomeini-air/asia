package com.handys.asia.api.controller.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(NON_NULL)
public class CandidateTaskResponse extends TaskBaseResponse {
    private UUID uuid;
    private String email;
    private String firstName;
    private String lastName;
    private Long taskId;
    private String taskName;
    private Long duration;
    private Long extraTime;
    private String submissionLink;
    private String comments;
    private Long startedAt;
    private Long submittedAt;
}
