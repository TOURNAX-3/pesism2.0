package com.tournax.application.dto;

import com.tournax.domain.model.TournamentPlayer;
import java.time.Instant;
import java.util.UUID;

public record AdminRegistrationRow(
    UUID playerId,
    String name,
    String gamingUsername,
    String email,
    String waNumber,
    String city,
    String efootballUsername,
    String avatarUrl,
    boolean emailVerified,
    Instant emailVerifiedAt,
    boolean approved,
    Instant joinedAt
) {
    public static AdminRegistrationRow from(TournamentPlayer entry) {
        var player = entry.getPlayer();
        return new AdminRegistrationRow(
            player.getId(),
            player.getName(),
            player.getGamingUsername(),
            player.getEmail(),
            player.getWaNumber(),
            player.getCity(),
            player.getEfootballId(),
            player.getAvatarUrl(),
            player.isEmailVerified(),
            player.getEmailVerifiedAt(),
            entry.isApproved(),
            entry.getJoinedAt()
        );
    }
}
