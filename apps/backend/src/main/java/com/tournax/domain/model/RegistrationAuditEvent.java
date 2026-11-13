package com.tournax.domain.model;

import com.tournax.application.ClientRequestContext;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "registration_audit_events")
public class RegistrationAuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tournament_id")
    private UUID tournamentId;

    @Column(name = "player_id")
    private UUID playerId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    private String email;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "ip_country")
    private String ipCountry;

    @Column(name = "ip_region")
    private String ipRegion;

    @Column(name = "ip_city")
    private String ipCity;

    @Column(name = "user_agent")
    private String userAgent;

    private String referer;

    @Column(name = "accept_language")
    private String acceptLanguage;

    @Column(name = "form_city")
    private String formCity;

    private String detail;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    protected RegistrationAuditEvent() {}

    public static RegistrationAuditEvent of(
        UUID tournamentId,
        UUID playerId,
        String eventType,
        String email,
        ClientRequestContext client,
        String formCity,
        String detail
    ) {
        RegistrationAuditEvent e = new RegistrationAuditEvent();
        e.tournamentId = tournamentId;
        e.playerId = playerId;
        e.eventType = eventType;
        e.email = email;
        if (client != null) {
            e.ipAddress = truncate(client.ipAddress(), 128);
            e.ipCountry = truncate(client.country(), 64);
            e.ipRegion = truncate(client.region(), 128);
            e.ipCity = truncate(client.city(), 128);
            e.userAgent = truncate(client.userAgent(), 512);
            e.referer = truncate(client.referer(), 512);
            e.acceptLanguage = truncate(client.acceptLanguage(), 128);
        }
        e.formCity = truncate(formCity, 120);
        e.detail = truncate(detail, 2000);
        return e;
    }

    private static String truncate(String value, int max) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String t = value.trim();
        return t.length() <= max ? t : t.substring(0, max);
    }

    public Long getId() {
        return id;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public String getEventType() {
        return eventType;
    }

    public String getEmail() {
        return email;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getIpCountry() {
        return ipCountry;
    }

    public String getIpRegion() {
        return ipRegion;
    }

    public String getIpCity() {
        return ipCity;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getReferer() {
        return referer;
    }

    public String getAcceptLanguage() {
        return acceptLanguage;
    }

    public String getFormCity() {
        return formCity;
    }

    public String getDetail() {
        return detail;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
