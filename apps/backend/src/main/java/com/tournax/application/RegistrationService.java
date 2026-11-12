package com.tournax.application;

import com.tournax.application.dto.RegistrationRequest;
import com.tournax.application.dto.RegistrationResponse;
import com.tournax.application.dto.RegistrationWindowResponse;
import com.tournax.application.exception.AlreadyRegisteredException;
import com.tournax.application.exception.IdentityConflictException;
import com.tournax.application.exception.RegistrationClosedException;
import com.tournax.application.exception.TournamentFullException;
import com.tournax.domain.model.Player;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.model.TournamentPlayer;
import com.tournax.domain.repository.PlayerRepository;
import com.tournax.domain.repository.TournamentPlayerRepository;
import com.tournax.domain.repository.TournamentRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final TournamentRepository tournamentRepository;
    private final PlayerRepository playerRepository;
    private final TournamentPlayerRepository tournamentPlayerRepository;
    private final Clock clock;

    public RegistrationService(
        TournamentRepository tournamentRepository,
        PlayerRepository playerRepository,
        TournamentPlayerRepository tournamentPlayerRepository,
        Clock clock
    ) {
        this.tournamentRepository = tournamentRepository;
        this.playerRepository = playerRepository;
        this.tournamentPlayerRepository = tournamentPlayerRepository;
        this.clock = clock;
    }

    public RegistrationWindowResponse windowForSeason(int season) {
        Tournament tournament = tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament found for season " + season));

        Instant now = clock.instant();
        long count = tournamentPlayerRepository.countByTournamentId(tournament.getId());
        return RegistrationWindowResponse.from(tournament, now).withCount(count);
    }

    @Transactional
    public RegistrationResponse registerForSeason(int season, RegistrationRequest request) {
        if (request.honeypot() != null && !request.honeypot().isBlank()) {
            throw new IllegalArgumentException("Invalid submission");
        }

        Tournament tournament = tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament found for season " + season));

        Instant now = clock.instant();
        if (!tournament.isRegistrationOpenAt(now)) {
            throw new RegistrationClosedException(tournament.getId(), now);
        }

        if (tournament.getMaxPlayers() != null) {
            long count = tournamentPlayerRepository.countByTournamentId(tournament.getId());
            if (count >= tournament.getMaxPlayers()) {
                throw new TournamentFullException(tournament.getId(), tournament.getMaxPlayers());
            }
        }

        String waNumber = PhoneNormalizer.normalize(request.phone());
        String email = request.email().trim().toLowerCase();

        Player player = resolvePlayer(request, waNumber, email);
        UUID playerId = player.getId();

        if (tournamentPlayerRepository.existsByIdTournamentIdAndIdPlayerId(tournament.getId(), playerId)) {
            throw new AlreadyRegisteredException(tournament.getId(), playerId);
        }

        tournamentPlayerRepository.save(TournamentPlayer.pending(tournament, player));

        return RegistrationResponse.registered(player.getId(), tournament.getId(), false);
    }

    private static String normalizeAvatarUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String url = raw.trim();
        if (url.length() > 2048) {
            throw new IllegalArgumentException("Avatar URL is too long.");
        }
        if (!url.startsWith("https://")) {
            throw new IllegalArgumentException("Avatar URL must be https.");
        }
        return url;
    }

    private Player resolvePlayer(RegistrationRequest request, String waNumber, String email) {
        var byWa = playerRepository.findByWaNumber(waNumber);
        var byEmail = playerRepository.findByEmailIgnoreCase(email);

        if (byWa.isPresent() && byEmail.isPresent()) {
            if (!byWa.get().getId().equals(byEmail.get().getId())) {
                throw new IdentityConflictException(
                    "This WhatsApp number and email belong to different existing accounts. Contact an admin."
                );
            }
            return byWa.get();
        }

        if (byWa.isPresent()) {
            Player existing = byWa.get();
            if (!existing.getEmail().equalsIgnoreCase(email)) {
                throw new IdentityConflictException(
                    "This WhatsApp number is already registered with a different email."
                );
            }
            return existing;
        }

        if (byEmail.isPresent()) {
            throw new IdentityConflictException(
                "This email is already registered with a different WhatsApp number."
            );
        }

        String gaming = request.gamingUsername().trim();
        if (playerRepository.findByGamingUsernameIgnoreCase(gaming).isPresent()) {
            throw new IdentityConflictException("This gaming username is already taken.");
        }

        String avatarUrl = normalizeAvatarUrl(request.avatarUrl());
        Player player = Player.register(
            request.name().trim(),
            waNumber,
            email,
            request.gamingUsername().trim(),
            request.efootballUsername() != null ? request.efootballUsername().trim() : null,
            request.city() != null ? request.city().trim() : null,
            avatarUrl
        );

        try {
            return playerRepository.save(player);
        } catch (DataIntegrityViolationException ex) {
            throw new AlreadyRegisteredException(null, null);
        }
    }
}
