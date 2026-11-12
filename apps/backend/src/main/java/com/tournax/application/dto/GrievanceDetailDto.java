package com.tournax.application.dto;

import com.tournax.domain.model.GrievanceCategory;
import com.tournax.domain.model.GrievanceStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GrievanceDetailDto(
    UUID id,
    UUID playerId,
    String playerName,
    String playerEmail,
    String playerWaNumber,
    GrievanceCategory category,
    String subject,
    String message,
    GrievanceStatus status,
    Instant createdAt,
    Instant updatedAt,
    List<GrievanceCommentDto> comments
) {}
