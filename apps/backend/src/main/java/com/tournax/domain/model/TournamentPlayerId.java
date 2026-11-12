package com.tournax.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class TournamentPlayerId implements Serializable {

    @Column(name = "tournament_id")
    private UUID tournamentId;

    @Column(name = "player_id")
    private UUID playerId;

    protected TournamentPlayerId() {}

    public TournamentPlayerId(UUID tournamentId, UUID playerId) {
        this.tournamentId = tournamentId;
        this.playerId = playerId;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TournamentPlayerId that = (TournamentPlayerId) o;
        return Objects.equals(tournamentId, that.tournamentId) && Objects.equals(playerId, that.playerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tournamentId, playerId);
    }
}
