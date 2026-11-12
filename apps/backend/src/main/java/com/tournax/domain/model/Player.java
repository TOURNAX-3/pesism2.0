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
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "wa_number", nullable = false, unique = true)
    private String waNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "gaming_username", nullable = false, unique = true)
    private String gamingUsername;

    @Column(name = "efootball_id")
    private String efootballId;

    private String city;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_admin", nullable = false)
    private boolean admin;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private Instant createdAt;

    protected Player() {}

    public static Player register(
        String name,
        String waNumber,
        String email,
        String gamingUsername,
        String efootballId,
        String city,
        String avatarUrl
    ) {
        Player player = new Player();
        player.name = name;
        player.waNumber = waNumber;
        player.email = email.trim().toLowerCase();
        player.gamingUsername = gamingUsername;
        player.efootballId = efootballId;
        player.city = city;
        player.avatarUrl = avatarUrl;
        player.admin = false;
        return player;
    }

    public void updateProfile(String name, String gamingUsername, String efootballId, String city, String avatarUrl) {
        if (name != null && !name.isBlank()) {
            this.name = name.trim();
        }
        if (gamingUsername != null && !gamingUsername.isBlank()) {
            this.gamingUsername = gamingUsername.trim();
        }
        if (efootballId != null) {
            this.efootballId = efootballId.trim();
        }
        if (city != null && !city.isBlank()) {
            this.city = city.trim();
        }
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            this.avatarUrl = avatarUrl.trim();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getWaNumber() {
        return waNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getGamingUsername() {
        return gamingUsername;
    }

    public String getEfootballId() {
        return efootballId;
    }

    public String getCity() {
        return city;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
