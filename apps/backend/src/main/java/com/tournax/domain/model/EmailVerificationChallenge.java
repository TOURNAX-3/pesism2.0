package com.tournax.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "email_verification_challenges")
public class EmailVerificationChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "player_id", nullable = false)
    private UUID playerId;

    @Column(name = "tournament_id", nullable = false)
    private UUID tournamentId;

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

    protected EmailVerificationChallenge() {}

    public static EmailVerificationChallenge create(
        UUID playerId,
        UUID tournamentId,
        String codeHash,
        Instant expiresAt,
        Instant now
    ) {
        EmailVerificationChallenge c = new EmailVerificationChallenge();
        c.playerId = playerId;
        c.tournamentId = tournamentId;
        c.codeHash = codeHash;
        c.expiresAt = expiresAt;
        c.attemptCount = 0;
        c.lastSentAt = now;
        return c;
    }

    public UUID getId() {
        return id;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public UUID getTournamentId() {
        return tournamentId;
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

    public void refreshSent(Instant now) {
        lastSentAt = now;
    }
}
