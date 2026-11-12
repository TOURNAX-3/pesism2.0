package com.tournax.application.exception;

import java.time.Instant;
import java.util.UUID;

public class RegistrationClosedException extends RuntimeException {
    private final UUID tournamentId;
    private final Instant at;

    public RegistrationClosedException(UUID tournamentId, Instant at) {
        super("Registration is closed");
        this.tournamentId = tournamentId;
        this.at = at;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public Instant getAt() {
        return at;
    }
}
