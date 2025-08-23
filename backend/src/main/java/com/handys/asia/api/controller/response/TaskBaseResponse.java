package com.handys.asia.api.controller.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class TaskBaseResponse {
    private String createdBy;

    @JsonFormat(pattern = "MMM, dd yyyy, HH:mm")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "MMM, dd yyyy, HH:mm")
    private LocalDateTime updatedAt;
}
