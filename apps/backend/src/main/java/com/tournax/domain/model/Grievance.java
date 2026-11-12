package com.tournax.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "grievances")
public class Grievance {

    @Id
    private UUID id;

    @Column(name = "tournament_id", nullable = false)
    private UUID tournamentId;

    @Column(name = "player_id", nullable = false)
    private UUID playerId;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "grievance_category")
    private GrievanceCategory category;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "grievance_status")
    private GrievanceStatus status = GrievanceStatus.open;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Grievance() {}

    public Grievance(
        UUID id,
        UUID tournamentId,
        UUID playerId,
        GrievanceCategory category,
        String subject,
        String message
    ) {
        this.id = id;
        this.tournamentId = tournamentId;
        this.playerId = playerId;
        this.category = category;
        this.subject = subject.trim();
        this.message = message.trim();
    }

    public UUID getId() {
        return id;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public GrievanceCategory getCategory() {
        return category;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public GrievanceStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setStatus(GrievanceStatus status, Instant now) {
        this.status = status;
        this.updatedAt = now;
    }

    public void touchUpdatedAt(Instant now) {
        this.updatedAt = now;
    }
}
