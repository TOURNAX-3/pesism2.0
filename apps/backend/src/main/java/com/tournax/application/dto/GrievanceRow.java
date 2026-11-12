package com.tournax.application.dto;

import com.tournax.domain.model.GrievanceCategory;
import com.tournax.domain.model.GrievanceStatus;
import java.time.Instant;
import java.util.UUID;

public record GrievanceRow(
    UUID id,
    String playerName,
    GrievanceCategory category,
    String subject,
    GrievanceStatus status,
    Instant createdAt,
    Instant updatedAt,
    int commentCount
) {}
