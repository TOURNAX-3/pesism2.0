package com.tournax.application.dto;

import java.util.List;

public record CreateSponsorRequest(
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