package com.tournax.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddGrievanceCommentRequest(@NotBlank @Size(max = 4000) String body) {}
