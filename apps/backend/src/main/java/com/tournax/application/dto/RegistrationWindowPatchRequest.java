package com.tournax.application.dto;

import com.tournax.domain.model.TournamentStatus;
import java.time.Instant;

public record RegistrationWindowPatchRequest(
    TournamentStatus status,
    Instant registrationOpensAt,
    Instant registrationClosesAt,
    Integer maxPlayers
) {}
