package com.handys.asia.api.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
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
}
