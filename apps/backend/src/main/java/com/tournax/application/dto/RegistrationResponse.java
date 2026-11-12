package com.tournax.application.dto;

import java.util.UUID;

public record RegistrationResponse(UUID playerId, UUID tournamentId, boolean approved, String message) {
    public static RegistrationResponse registered(UUID playerId, UUID tournamentId, boolean approved) {
        return new RegistrationResponse(
            playerId,
            tournamentId,
            approved,
            "You are on the list. We will confirm your slot soon."
        );
    }
}
