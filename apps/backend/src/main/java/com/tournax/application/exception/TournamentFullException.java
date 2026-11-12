package com.tournax.application.exception;

import java.util.UUID;

public class TournamentFullException extends RuntimeException {
    private final UUID tournamentId;
    private final int maxPlayers;

    public TournamentFullException(UUID tournamentId, int maxPlayers) {
        super("All slots are taken");
        this.tournamentId = tournamentId;
        this.maxPlayers = maxPlayers;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public int getMaxPlayers() {
        return maxPlayers;
    }
}
