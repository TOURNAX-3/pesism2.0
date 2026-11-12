package com.tournax.application.dto;

import java.util.UUID;

public record RecordMatchRequest(
    UUID matchId,
    int matchday,
    UUID homePlayerId,
    UUID awayPlayerId,
    int homeGoals,
    int awayGoals,
    MatchStatsInput stats
) {}
