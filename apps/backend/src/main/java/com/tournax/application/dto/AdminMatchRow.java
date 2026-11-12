package com.tournax.application.dto;

import com.tournax.domain.model.MatchStatus;
import java.time.Instant;
import java.util.UUID;

public record AdminMatchRow(
    UUID id,
    int matchday,
    UUID homePlayerId,
    UUID awayPlayerId,
    String homeName,
    String awayName,
    Integer homeGoals,
    Integer awayGoals,
    MatchStatus status,
    Instant updatedAt,
    boolean hasStats
) {}
