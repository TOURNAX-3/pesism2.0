package com.tournax.application.dto;

import com.tournax.domain.model.Tournament;
import java.time.Instant;
import java.util.UUID;

public record RegistrationWindowResponse(
    UUID tournamentId,
    String name,
    int season,
    boolean open,
    Instant opensAt,
    Instant closesAt,
    Integer maxPlayers,
    long registeredCount,
    String reason
) {
    public static RegistrationWindowResponse from(Tournament tournament, Instant now) {
        boolean open = tournament.isRegistrationOpenAt(now);
        String reason = null;
        if (!open) {
            if (tournament.getStatus() != com.tournax.domain.model.TournamentStatus.registration) {
                reason = "Registration is not open for this tournament phase.";
            } else if (tournament.getRegistrationOpensAt() != null && now.isBefore(tournament.getRegistrationOpensAt())) {
                reason = "Registration has not opened yet.";
            } else if (tournament.getRegistrationClosesAt() != null && !now.isBefore(tournament.getRegistrationClosesAt())) {
                reason = "Registration is closed.";
            }
        }
        return new RegistrationWindowResponse(
            tournament.getId(),
            tournament.getName(),
            tournament.getSeason(),
            open,
            tournament.getRegistrationOpensAt(),
            tournament.getRegistrationClosesAt(),
            tournament.getMaxPlayers(),
            0,
            reason
        );
    }

    public RegistrationWindowResponse withCount(long count) {
        return new RegistrationWindowResponse(
            tournamentId,
            name,
            season,
            open,
            opensAt,
            closesAt,
            maxPlayers,
            count,
            reason
        );
    }
}
