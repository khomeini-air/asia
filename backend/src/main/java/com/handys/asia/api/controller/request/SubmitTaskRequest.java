package com.handys.asia.api.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitTaskRequest {
    @NotBlank
    private String submissionLink;

    @NotNull
    private Long submittedAt;

    private String comments;
}
