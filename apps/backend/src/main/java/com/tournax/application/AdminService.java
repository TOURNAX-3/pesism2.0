package com.tournax.application;

import com.tournax.application.dto.AdminDashboardResponse;
import com.tournax.application.dto.AdminRegistrationRow;
import com.tournax.application.dto.RegistrationWindowPatchRequest;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.model.TournamentPlayer;
import com.tournax.domain.model.TournamentPlayerId;
import com.tournax.domain.model.TournamentStatus;
import com.tournax.domain.model.Player;
import com.tournax.domain.repository.PlayerRepository;
import com.tournax.domain.repository.TournamentPlayerRepository;
import com.tournax.domain.model.RegistrationAuditEvent;
import com.tournax.domain.repository.TournamentRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final TournamentRepository tournamentRepository;
    private final TournamentPlayerRepository tournamentPlayerRepository;
    private final PlayerRepository playerRepository;
    private final RegistrationAuditService registrationAuditService;
    private final Clock clock;

    public AdminService(
        TournamentRepository tournamentRepository,
        TournamentPlayerRepository tournamentPlayerRepository,
        PlayerRepository playerRepository,
        RegistrationAuditService registrationAuditService,
        Clock clock
    ) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentPlayerRepository = tournamentPlayerRepository;
        this.playerRepository = playerRepository;
        this.registrationAuditService = registrationAuditService;
        this.clock = clock;
    }

    public AdminDashboardResponse dashboard(int season) {
        Tournament tournament = requireSeason(season);
        long total = tournamentPlayerRepository.countByTournamentId(tournament.getId());
        long approved = tournamentPlayerRepository.countApprovedByTournamentId(tournament.getId());
        Instant now = clock.instant();
        return new AdminDashboardResponse(
            tournament.getId(),
            tournament.getName(),
            season,
            tournament.getStatus(),
            tournament.isRegistrationOpenAt(now),
            tournament.getRegistrationOpensAt(),
            tournament.getRegistrationClosesAt(),
            tournament.getMaxPlayers(),
            total,
            approved,
            total - approved
        );
    }

    public List<AdminRegistrationRow> listRegistrations(int season) {
        Tournament tournament = requireSeason(season);
        return tournamentPlayerRepository.findAllByTournamentIdWithPlayer(tournament.getId()).stream()
            .map(AdminRegistrationRow::from)
            .toList();
    }

    public List<RegistrationAuditEvent> registrationAudit(int season) {
        Tournament tournament = requireSeason(season);
        return registrationAuditService.recentForTournament(tournament.getId());
    }

    @Transactional
    public void approveRegistration(int season, UUID playerId) {
        Tournament tournament = requireSeason(season);
        TournamentPlayer entry =
            tournamentPlayerRepository
                .findById(new TournamentPlayerId(tournament.getId(), playerId))
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        if (!entry.getPlayer().isEmailVerified()) {
            throw new IllegalArgumentException("Player has not verified their email yet.");
        }
        entry.approve();
    }

    @Transactional
    public void removeRegistration(int season, UUID playerId) {
        Tournament tournament = requireSeason(season);
        tournamentPlayerRepository.deleteById(new TournamentPlayerId(tournament.getId(), playerId));
    }

    @Transactional
    public AdminDashboardResponse updateRegistrationWindow(int season, RegistrationWindowPatchRequest patch) {
        Tournament tournament = requireSeason(season);
        if (patch.status() != null) {
            tournament.setStatus(patch.status());
        }
        if (patch.registrationOpensAt() != null) {
            tournament.setRegistrationOpensAt(patch.registrationOpensAt());
        }
        if (patch.registrationClosesAt() != null) {
            tournament.setRegistrationClosesAt(patch.registrationClosesAt());
        }
        if (patch.maxPlayers() != null) {
            tournament.setMaxPlayers(patch.maxPlayers());
        }
        tournamentRepository.save(tournament);
        return dashboard(season);
    }

    @Transactional
    public AdminDashboardResponse closeRegistration(int season) {
        Tournament tournament = requireSeason(season);
        tournament.setStatus(TournamentStatus.league);
        tournament.setRegistrationClosesAt(clock.instant());
        tournamentRepository.save(tournament);
        return dashboard(season);
    }

    /** Puts the tournament back in the registration phase and extends the close date (e.g. after an accidental close). */
    @Transactional
    public void updatePlayerAvatar(int season, UUID playerId, String avatarUrl) {
        Tournament tournament = requireSeason(season);
        tournamentPlayerRepository
            .findById(new TournamentPlayerId(tournament.getId(), playerId))
            .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        if (!avatarUrl.startsWith("https://")) {
            throw new IllegalArgumentException("Avatar URL must be https");
        }
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new IllegalArgumentException("Player not found"));
        player.updateProfile(null, null, null, null, avatarUrl.trim());
        playerRepository.save(player);
    }

    @Transactional
    public AdminDashboardResponse openRegistration(int season) {
        Tournament tournament = requireSeason(season);
        Instant now = clock.instant();
        tournament.setStatus(TournamentStatus.registration);
        if (tournament.getRegistrationOpensAt() == null || tournament.getRegistrationOpensAt().isAfter(now)) {
            tournament.setRegistrationOpensAt(now.minusSeconds(1));
        }
        tournament.setRegistrationClosesAt(now.plus(30, ChronoUnit.DAYS));
        tournamentRepository.save(tournament);
        return dashboard(season);
    }

    private Tournament requireSeason(int season) {
        return tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament for season " + season));
    }
}
