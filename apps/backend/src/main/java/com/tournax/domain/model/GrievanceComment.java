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
@Table(name = "grievance_comments")
public class GrievanceComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grievance_id", nullable = false)
    private UUID grievanceId;

    @Column(nullable = false, columnDefinition = "text")
    private String body;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected GrievanceComment() {}

    public static GrievanceComment create(UUID grievanceId, String body) {
        GrievanceComment c = new GrievanceComment();
        c.grievanceId = grievanceId;
        c.body = body.trim();
        return c;
    }

    public Long getId() {
        return id;
    }

    public UUID getGrievanceId() {
        return grievanceId;
    }

    public String getBody() {
        return body;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
