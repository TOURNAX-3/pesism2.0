package com.tournax.application.dto;

import com.tournax.domain.model.TournamentStatus;
import java.time.Instant;
import java.util.UUID;

public record AdminDashboardResponse(
    UUID tournamentId,
    String name,
    int season,
    TournamentStatus status,
    boolean registrationOpen,
    Instant registrationOpensAt,
    Instant registrationClosesAt,
    Integer maxPlayers,
    long totalRegistrations,
    long approvedCount,
    long pendingCount
) {}
