package com.tournax.application;

import com.tournax.application.dto.AddGrievanceCommentRequest;
import com.tournax.application.dto.GrievanceCommentDto;
import com.tournax.application.dto.GrievanceDetailDto;
import com.tournax.application.dto.GrievanceRow;
import com.tournax.application.dto.SubmitGrievanceRequest;
import com.tournax.application.dto.UpdateGrievanceStatusRequest;
import com.tournax.domain.model.Grievance;
import com.tournax.domain.model.GrievanceComment;
import com.tournax.domain.model.Player;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.repository.GrievanceCommentRepository;
import com.tournax.domain.repository.GrievanceRepository;
import com.tournax.domain.repository.PlayerRepository;
import com.tournax.domain.repository.TournamentPlayerRepository;
import com.tournax.domain.repository.TournamentRepository;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GrievanceService {

    private final TournamentRepository tournamentRepository;
    private final TournamentPlayerRepository tournamentPlayerRepository;
    private final PlayerRepository playerRepository;
    private final GrievanceRepository grievanceRepository;
    private final GrievanceCommentRepository grievanceCommentRepository;
    private final Clock clock;
    private final String honeypotField;

    public GrievanceService(
        TournamentRepository tournamentRepository,
        TournamentPlayerRepository tournamentPlayerRepository,
        PlayerRepository playerRepository,
        GrievanceRepository grievanceRepository,
        GrievanceCommentRepository grievanceCommentRepository,
        Clock clock,
        @Value("${tournax.registration.honeypot-field:website}") String honeypotField
    ) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentPlayerRepository = tournamentPlayerRepository;
        this.playerRepository = playerRepository;
        this.grievanceRepository = grievanceRepository;
        this.grievanceCommentRepository = grievanceCommentRepository;
        this.clock = clock;
        this.honeypotField = honeypotField;
    }

    @Transactional
    public UUID submit(int season, SubmitGrievanceRequest body) {
        if (body.website() != null && !body.website().isBlank()) {
            throw new IllegalArgumentException("validation_error");
        }
        Tournament tournament = requireSeason(season);
        String wa = PhoneNormalizer.normalize(body.waNumber());
        Player player =
            playerRepository
                .findByWaNumber(wa)
                .orElseThrow(() -> new IllegalArgumentException("Not a registered player. Use your Season WhatsApp number."));
        tournamentPlayerRepository
            .findApprovedEntry(tournament.getId(), player.getId())
            .orElseThrow(() -> new IllegalArgumentException("Only approved Season players can file a grievance."));

        Grievance g =
            new Grievance(
                UUID.randomUUID(),
                tournament.getId(),
                player.getId(),
                body.category(),
                body.subject(),
                body.message()
            );
        grievanceRepository.save(g);
        return g.getId();
    }

    @Transactional(readOnly = true)
    public List<GrievanceRow> listForAdmin(int season) {
        Tournament tournament = requireSeason(season);
        List<Grievance> list = grievanceRepository.findAllByTournamentIdOrderByCreatedAtDesc(tournament.getId());
        Map<UUID, Player> players =
            playerRepository
                .findAllById(list.stream().map(Grievance::getPlayerId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Player::getId, Function.identity()));
        return list.stream()
            .map(
                g ->
                    new GrievanceRow(
                        g.getId(),
                        players.get(g.getPlayerId()) != null ? players.get(g.getPlayerId()).getName() : g.getPlayerId().toString(),
                        g.getCategory(),
                        g.getSubject(),
                        g.getStatus(),
                        g.getCreatedAt(),
                        g.getUpdatedAt(),
                        grievanceCommentRepository.findAllByGrievanceIdOrderByCreatedAtAsc(g.getId()).size()
                    )
            )
            .toList();
    }

    @Transactional(readOnly = true)
    public GrievanceDetailDto detailForAdmin(int season, UUID grievanceId) {
        Tournament tournament = requireSeason(season);
        Grievance g =
            grievanceRepository
                .findById(grievanceId)
                .filter(x -> x.getTournamentId().equals(tournament.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found"));
        Player player = playerRepository.findById(g.getPlayerId()).orElseThrow();
        List<GrievanceCommentDto> comments =
            grievanceCommentRepository.findAllByGrievanceIdOrderByCreatedAtAsc(g.getId()).stream()
                .map(c -> new GrievanceCommentDto(c.getId(), c.getBody(), c.getCreatedAt()))
                .toList();
        return new GrievanceDetailDto(
            g.getId(),
            player.getId(),
            player.getName(),
            player.getEmail(),
            player.getWaNumber(),
            g.getCategory(),
            g.getSubject(),
            g.getMessage(),
            g.getStatus(),
            g.getCreatedAt(),
            g.getUpdatedAt(),
            comments
        );
    }

    @Transactional
    public GrievanceDetailDto updateStatus(int season, UUID grievanceId, UpdateGrievanceStatusRequest body) {
        Tournament tournament = requireSeason(season);
        Grievance g =
            grievanceRepository
                .findById(grievanceId)
                .filter(x -> x.getTournamentId().equals(tournament.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found"));
        g.setStatus(body.status(), clock.instant());
        grievanceRepository.save(g);
        return detailForAdmin(season, grievanceId);
    }

    @Transactional
    public GrievanceDetailDto addComment(int season, UUID grievanceId, AddGrievanceCommentRequest body) {
        Tournament tournament = requireSeason(season);
        Grievance g =
            grievanceRepository
                .findById(grievanceId)
                .filter(x -> x.getTournamentId().equals(tournament.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found"));
        grievanceCommentRepository.save(GrievanceComment.create(g.getId(), body.body()));
        g.touchUpdatedAt(clock.instant());
        grievanceRepository.save(g);
        return detailForAdmin(season, grievanceId);
    }

    private Tournament requireSeason(int season) {
        return tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament for season " + season));
    }
}
