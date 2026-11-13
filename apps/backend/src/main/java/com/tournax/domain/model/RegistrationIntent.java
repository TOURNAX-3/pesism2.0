package com.tournax.domain.model;

import com.tournax.application.dto.RegistrationIntentPayload;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "registration_intents")
public class RegistrationIntent {

    @Id
    private UUID id;

    @Column(name = "tournament_id", nullable = false)
    private UUID tournamentId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "wa_number", nullable = false)
    private String waNumber;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    private RegistrationIntentPayload payload;

    @Column(name = "code_hash", nullable = false)
    private String codeHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "last_sent_at", nullable = false)
    private Instant lastSentAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    protected RegistrationIntent() {}

    public static RegistrationIntent create(
        UUID id,
        UUID tournamentId,
        String email,
        String waNumber,
        RegistrationIntentPayload payload,
        String codeHash,
        Instant expiresAt,
        Instant now
    ) {
        RegistrationIntent intent = new RegistrationIntent();
        intent.id = id;
        intent.tournamentId = tournamentId;
        intent.email = email;
        intent.waNumber = waNumber;
        intent.payload = payload;
        intent.codeHash = codeHash;
        intent.expiresAt = expiresAt;
        intent.attemptCount = 0;
        intent.lastSentAt = now;
        return intent;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public String getEmail() {
        return email;
    }

    public String getWaNumber() {
        return waNumber;
    }

    public RegistrationIntentPayload getPayload() {
        return payload;
    }

    public String getCodeHash() {
        return codeHash;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public Instant getLastSentAt() {
        return lastSentAt;
    }

    public void recordAttempt() {
        attemptCount++;
    }

    public void refreshCode(String newHash, Instant newExpiry, Instant now) {
        codeHash = newHash;
        expiresAt = newExpiry;
        attemptCount = 0;
        lastSentAt = now;
    }

    public void replaceDetails(
        String waNumber,
        RegistrationIntentPayload payload,
        String codeHash,
        Instant expiresAt,
        Instant now
    ) {
        this.waNumber = waNumber;
        this.payload = payload;
        refreshCode(codeHash, expiresAt, now);
    }

    /** Same OTP; refresh stored form fields only (duplicate submit). */
    public void updateFormDetails(String waNumber, RegistrationIntentPayload payload) {
        this.waNumber = waNumber;
        this.payload = payload;
    }
}
