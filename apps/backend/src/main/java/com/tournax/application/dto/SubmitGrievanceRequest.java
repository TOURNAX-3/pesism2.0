package com.tournax.application.dto;

import com.tournax.domain.model.GrievanceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SubmitGrievanceRequest(
    @NotBlank @Pattern(regexp = "^[0-9]{10,15}$") String waNumber,
    @NotNull GrievanceCategory category,
    @NotBlank @Size(max = 200) String subject,
    @NotBlank @Size(max = 4000) String message,
    @Size(max = 100) String website
) {}
