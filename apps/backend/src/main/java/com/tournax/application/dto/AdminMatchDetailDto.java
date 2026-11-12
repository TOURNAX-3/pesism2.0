package com.tournax.application.dto;

import com.tournax.domain.model.MatchStatus;
import java.time.Instant;
import java.util.UUID;

public record AdminMatchDetailDto(
    UUID id,
    int matchday,
    UUID homePlayerId,
    UUID awayPlayerId,
    String homeName,
    String awayName,
    int homeGoals,
    int awayGoals,
    MatchStatus status,
    Instant updatedAt,
    MatchStatsInput stats
) {}
