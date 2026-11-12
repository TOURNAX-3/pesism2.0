package com.tournax.application.dto;

import com.tournax.domain.model.GrievanceStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateGrievanceStatusRequest(@NotNull GrievanceStatus status) {}
