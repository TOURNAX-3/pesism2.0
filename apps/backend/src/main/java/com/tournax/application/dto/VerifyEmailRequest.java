package com.tournax.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyEmailRequest(@NotBlank @Pattern(regexp = "\\d{4}") String code) {}
