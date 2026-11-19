package com.tournax.application.dto;

import java.util.List;
import java.util.UUID;

public record SponsorDto(
    UUID id,
    String name,
    String tagline,
    String description,
    String productUrl,
    String logoUrl,
    String instagramUrl,
    String telegramUrl,
    List<String> productImageUrls,
    boolean bannerActive
) {}