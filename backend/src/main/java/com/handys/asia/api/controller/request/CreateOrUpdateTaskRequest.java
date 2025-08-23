package com.handys.asia.api.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrUpdateTaskRequest {

    @NotBlank
    @Size(max = 15)
    private String taskName;

    @NotBlank
    private String title;

    @NotBlank
    private String description;
}
