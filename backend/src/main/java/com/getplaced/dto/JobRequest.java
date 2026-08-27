package com.getplaced.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Requirements are required")
    private String requirements;

    @NotBlank(message = "Location is required")
    private String location;

    private String salary;

    private String experience;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private Boolean isOpen = true;
}
