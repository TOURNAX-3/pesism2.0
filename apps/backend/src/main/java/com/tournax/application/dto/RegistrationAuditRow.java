package com.tournax.application.dto;

import com.tournax.domain.model.RegistrationAuditEvent;
import java.time.Instant;
import java.util.UUID;

public record RegistrationAuditRow(
    long id,
    UUID tournamentId,
    UUID playerId,
    String eventType,
    String email,
    String ipAddress,
    String ipCountry,
    String ipRegion,
    String ipCity,
    String userAgent,
    String referer,
    String acceptLanguage,
    String formCity,
    String detail,
    Instant createdAt
) {
    public static RegistrationAuditRow from(RegistrationAuditEvent event) {
        return new RegistrationAuditRow(
            event.getId() != null ? event.getId() : 0L,
            event.getTournamentId(),
            event.getPlayerId(),
            event.getEventType(),
            event.getEmail(),
            event.getIpAddress(),
            event.getIpCountry(),
            event.getIpRegion(),
            event.getIpCity(),
            event.getUserAgent(),
            event.getReferer(),
            event.getAcceptLanguage(),
            event.getFormCity(),
            event.getDetail(),
            event.getCreatedAt()
        );
    }
}
