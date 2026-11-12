package com.tournax.application.exception;

import java.util.UUID;

public class AlreadyRegisteredException extends RuntimeException {
    private final UUID tournamentId;
    private final UUID playerId;

    public AlreadyRegisteredException(UUID tournamentId, UUID playerId) {
        super("You are already registered for this tournament");
        this.tournamentId = tournamentId;
        this.playerId = playerId;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public UUID getPlayerId() {
        return playerId;
    }
}
