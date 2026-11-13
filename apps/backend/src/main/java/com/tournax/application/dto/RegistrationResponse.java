package com.tournax.application.dto;

import java.util.UUID;

public record RegistrationResponse(
    UUID playerId,
    UUID tournamentId,
    boolean approved,
    boolean emailVerificationRequired,
    String message
) {
    public static RegistrationResponse pendingVerification(UUID playerId, UUID tournamentId) {
        return new RegistrationResponse(
            playerId,
            tournamentId,
            false,
            true,
            "Check your inbox for a 4-digit code. Registration completes after you enter it."
        );
    }

    public static RegistrationResponse registered(UUID playerId, UUID tournamentId, boolean approved) {
        return new RegistrationResponse(
            playerId,
            tournamentId,
            approved,
            false,
            "You are on the list. We will confirm your slot soon."
        );
    }
}
