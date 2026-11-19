package com.tournax.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "sponsors")
public class Sponsor {

    @Id
    private UUID id;

    @Column(name = "tournament_id", nullable = false)
    private UUID tournamentId;

    @Column(nullable = false)
    private String name;

    private String tagline;

    private String description;

    @Column(name = "product_url")
    private String productUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "telegram_url")
    private String telegramUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "product_image_urls", nullable = false)
    private List<String> productImageUrls = new ArrayList<>();

    @Column(name = "banner_active", nullable = false)
    private boolean bannerActive;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Sponsor() {}

    public static Sponsor create(UUID tournamentId, String name) {
        Sponsor s = new Sponsor();
        s.id = UUID.randomUUID();
        s.tournamentId = tournamentId;
        s.name = name.trim();
        s.createdAt = Instant.now();
        s.updatedAt = Instant.now();
        return s;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTournamentId() {
        return tournamentId;
    }

    public String getName() {
        return name;
    }

    public String getTagline() {
        return tagline;
    }

    public String getDescription() {
        return description;
    }

    public String getProductUrl() {
        return productUrl;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public boolean isBannerActive() {
        return bannerActive;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setName(String name) {
        this.name = name.trim();
    }

    public void setTagline(String tagline) {
        this.tagline = tagline != null && tagline.isBlank() ? null : tagline;
    }

    public void setDescription(String description) {
        this.description = description != null && description.isBlank() ? null : description;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl != null && productUrl.isBlank() ? null : productUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl != null && logoUrl.isBlank() ? null : logoUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public String getTelegramUrl() {
        return telegramUrl;
    }

    public List<String> getProductImageUrls() {
        return productImageUrls;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl != null && instagramUrl.isBlank() ? null : instagramUrl;
    }

    public void setTelegramUrl(String telegramUrl) {
        this.telegramUrl = telegramUrl != null && telegramUrl.isBlank() ? null : telegramUrl;
    }

    public void setProductImageUrls(List<String> productImageUrls) {
        this.productImageUrls = productImageUrls != null ? new ArrayList<>(productImageUrls) : new ArrayList<>();
    }

    public void setBannerActive(boolean bannerActive) {
        this.bannerActive = bannerActive;
    }

    public void touchUpdatedAt(Instant now) {
        this.updatedAt = now;
    }
}