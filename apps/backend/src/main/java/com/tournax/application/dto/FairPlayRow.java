package com.tournax.application.dto;

import java.util.UUID;

public record FairPlayRow(
    UUID playerId,
    String playerName,
    int matchesWithStats,
    int fouls,
    int offsides
) {}
