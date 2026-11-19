package com.tournax.application;

import com.tournax.application.dto.CreateSponsorRequest;
import com.tournax.application.dto.SponsorDto;
import com.tournax.application.dto.UpdateSponsorRequest;
import com.tournax.domain.model.Sponsor;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.repository.SponsorRepository;
import com.tournax.domain.repository.TournamentRepository;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SponsorService {

    private static final int MAX_PRODUCT_IMAGES = 6;

    private final TournamentRepository tournamentRepository;
    private final SponsorRepository sponsorRepository;
    private final Clock clock;

    public SponsorService(TournamentRepository tournamentRepository, SponsorRepository sponsorRepository, Clock clock) {
        this.tournamentRepository = tournamentRepository;
        this.sponsorRepository = sponsorRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<SponsorDto> listPublic(int season) {
        Tournament tournament = requireSeason(season);
        return sponsorRepository.findAllByTournamentIdOrderByNameAsc(tournament.getId()).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public SponsorDto bannerSponsor(int season) {
        Tournament tournament = requireSeason(season);
        return sponsorRepository.findByTournamentIdAndBannerActiveTrue(tournament.getId()).map(this::toDto).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<SponsorDto> listAdmin(int season) {
        return listPublic(season);
    }

    @Transactional
    public SponsorDto create(int season, CreateSponsorRequest body) {
        if (body.name() == null || body.name().isBlank()) {
            throw new IllegalArgumentException("Sponsor name is required");
        }
        Tournament tournament = requireSeason(season);
        Sponsor sponsor = Sponsor.create(tournament.getId(), body.name());
        applyFields(
            sponsor,
            body.tagline(),
            body.description(),
            body.productUrl(),
            body.logoUrl(),
            body.instagramUrl(),
            body.telegramUrl(),
            body.productImageUrls()
        );
        if (body.bannerActive()) {
            clearBanner(tournament.getId());
            sponsor.setBannerActive(true);
        }
        sponsorRepository.save(sponsor);
        return toDto(sponsor);
    }

    @Transactional
    public SponsorDto update(int season, UUID sponsorId, UpdateSponsorRequest body) {
        Sponsor sponsor = requireSponsor(season, sponsorId);
        if (body.name() == null || body.name().isBlank()) {
            throw new IllegalArgumentException("Sponsor name is required");
        }
        sponsor.setName(body.name());
        applyFields(
            sponsor,
            body.tagline(),
            body.description(),
            body.productUrl(),
            body.logoUrl(),
            body.instagramUrl(),
            body.telegramUrl(),
            body.productImageUrls()
        );
        sponsor.touchUpdatedAt(clock.instant());
        sponsorRepository.save(sponsor);
        return toDto(sponsor);
    }

    @Transactional
    public void delete(int season, UUID sponsorId) {
        Sponsor sponsor = requireSponsor(season, sponsorId);
        sponsorRepository.delete(sponsor);
    }

    @Transactional
    public SponsorDto setBanner(int season, UUID sponsorId, boolean active) {
        Sponsor sponsor = requireSponsor(season, sponsorId);
        if (active) {
            clearBanner(sponsor.getTournamentId());
            sponsor.setBannerActive(true);
        } else {
            sponsor.setBannerActive(false);
        }
        sponsor.touchUpdatedAt(clock.instant());
        sponsorRepository.save(sponsor);
        return toDto(sponsor);
    }

    private void clearBanner(UUID tournamentId) {
        sponsorRepository.clearBannerForTournament(tournamentId);
    }

    private void applyFields(
        Sponsor sponsor,
        String tagline,
        String description,
        String productUrl,
        String logoUrl,
        String instagramUrl,
        String telegramUrl,
        List<String> productImageUrls
    ) {
        sponsor.setTagline(tagline);
        sponsor.setDescription(description);
        sponsor.setProductUrl(normalizeHttpsUrl(productUrl, "Product link"));
        sponsor.setLogoUrl(normalizeHttpsUrl(logoUrl, "Logo URL"));
        sponsor.setInstagramUrl(normalizeInstagramUrl(instagramUrl));
        sponsor.setTelegramUrl(normalizeTelegramUrl(telegramUrl));
        sponsor.setProductImageUrls(normalizeProductImages(productImageUrls));
    }

    private static List<String> normalizeProductImages(List<String> urls) {
        if (urls == null || urls.isEmpty()) {
            return List.of();
        }
        List<String> out = new ArrayList<>();
        for (String raw : urls) {
            if (raw == null || raw.isBlank()) {
                continue;
            }
            out.add(normalizeHttpsUrl(raw, "Product image URL"));
            if (out.size() >= MAX_PRODUCT_IMAGES) {
                break;
            }
        }
        return List.copyOf(out);
    }

    private static String normalizeHttpsUrl(String raw, String label) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        if (!trimmed.startsWith("https://")) {
            throw new IllegalArgumentException(label + " must use https://");
        }
        return trimmed;
    }

    private static String normalizeInstagramUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.startsWith("@")) {
            String handle = trimmed.substring(1).replaceAll("[/?#].*$", "").replaceAll("/$", "");
            if (handle.isBlank()) {
                return null;
            }
            return "https://www.instagram.com/" + handle;
        }
        if (!trimmed.contains("://") && !trimmed.contains("/") && trimmed.matches("[\\w.]+")) {
            return "https://www.instagram.com/" + trimmed;
        }
        String url = trimmed;
        if (url.startsWith("instagram.com") || url.startsWith("www.instagram.com")) {
            url = "https://" + url;
        } else if (url.startsWith("http://")) {
            url = "https://" + url.substring(7);
        }
        if (!url.startsWith("https://")) {
            throw new IllegalArgumentException("Instagram link must be @handle, a handle, or an instagram.com URL");
        }
        String host = hostOf(url).toLowerCase(Locale.ROOT);
        if (!host.equals("instagram.com") && !host.equals("www.instagram.com")) {
            throw new IllegalArgumentException("Instagram link must be an instagram.com URL");
        }
        try {
            URI uri = new URI(url);
            String path = uri.getPath() != null ? uri.getPath().replaceAll("/$", "") : "";
            return "https://www.instagram.com" + path;
        } catch (URISyntaxException e) {
            return url;
        }
    }

    private static String normalizeTelegramUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.startsWith("@")) {
            String handle = trimmed.substring(1).replaceAll("[/?#].*$", "").replaceAll("/$", "");
            if (handle.isBlank()) {
                return null;
            }
            return "https://t.me/" + handle;
        }
        if (!trimmed.contains("://") && !trimmed.contains("/") && trimmed.matches("[\\w+]+")) {
            return "https://t.me/" + trimmed;
        }
        if (trimmed.startsWith("https://")) {
            String host = hostOf(trimmed).toLowerCase(Locale.ROOT);
            if (!host.equals("t.me") && !host.equals("telegram.me") && !host.equals("www.telegram.me")) {
                throw new IllegalArgumentException("Telegram link must be a t.me or telegram.me URL");
            }
            return trimmed;
        }
        if (trimmed.startsWith("http://")) {
            String https = "https://" + trimmed.substring(7);
            String host = hostOf(https).toLowerCase(Locale.ROOT);
            if (!host.equals("t.me") && !host.equals("telegram.me") && !host.equals("www.telegram.me")) {
                throw new IllegalArgumentException("Telegram link must be a t.me or telegram.me URL");
            }
            return https;
        }
        if (trimmed.startsWith("t.me/") || trimmed.startsWith("telegram.me/")) {
            return "https://" + trimmed;
        }
        throw new IllegalArgumentException("Telegram link must be @handle, t.me/…, or https://t.me/…");
    }

    private static String normalizeSocialUrl(String url) {
        if (!url.startsWith("https://")) {
            throw new IllegalArgumentException("Social links must use https://");
        }
        return url;
    }

    private static String hostOf(String url) {
        try {
            URI uri = new URI(url);
            if (uri.getHost() == null) {
                throw new IllegalArgumentException("Invalid URL");
            }
            return uri.getHost();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid URL");
        }
    }

    private Sponsor requireSponsor(int season, UUID sponsorId) {
        Tournament tournament = requireSeason(season);
        return sponsorRepository
            .findById(sponsorId)
            .filter(s -> s.getTournamentId().equals(tournament.getId()))
            .orElseThrow(() -> new IllegalArgumentException("Sponsor not found"));
    }

    private Tournament requireSeason(int season) {
        return tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament for season " + season));
    }

    private SponsorDto toDto(Sponsor sponsor) {
        return new SponsorDto(
            sponsor.getId(),
            sponsor.getName(),
            sponsor.getTagline(),
            sponsor.getDescription(),
            sponsor.getProductUrl(),
            sponsor.getLogoUrl(),
            sponsor.getInstagramUrl(),
            sponsor.getTelegramUrl(),
            sponsor.getProductImageUrls() != null ? List.copyOf(sponsor.getProductImageUrls()) : List.of(),
            sponsor.isBannerActive()
        );
    }
}