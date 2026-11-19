package com.tournax.application.dto;

import java.util.List;

public record UpdateSponsorRequest(
    String name,
    String tagline,
    String description,
    String productUrl,
    String logoUrl,
    String instagramUrl,
    String telegramUrl,
    List<String> productImageUrls
) {}