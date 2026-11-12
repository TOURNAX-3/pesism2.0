package com.tournax.application;

import com.tournax.application.dto.FairPlayRow;
import com.tournax.domain.model.FootballMatch;
import com.tournax.domain.model.MatchStats;
import com.tournax.domain.model.MatchStatus;
import com.tournax.domain.model.Player;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.repository.FootballMatchRepository;
import com.tournax.domain.repository.MatchStatsRepository;
import com.tournax.domain.repository.PlayerRepository;
import com.tournax.domain.repository.TournamentRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FairPlayAdminService {

    private static final Set<MatchStatus> COUNTED =
        Set.of(MatchStatus.confirmed, MatchStatus.resolved, MatchStatus.forfeit);

    private final TournamentRepository tournamentRepository;
    private final FootballMatchRepository footballMatchRepository;
    private final MatchStatsRepository matchStatsRepository;
    private final PlayerRepository playerRepository;

    public FairPlayAdminService(
        TournamentRepository tournamentRepository,
        FootballMatchRepository footballMatchRepository,
        MatchStatsRepository matchStatsRepository,
        PlayerRepository playerRepository
    ) {
        this.tournamentRepository = tournamentRepository;
        this.footballMatchRepository = footballMatchRepository;
        this.matchStatsRepository = matchStatsRepository;
        this.playerRepository = playerRepository;
    }

    @Transactional(readOnly = true)
    public List<FairPlayRow> fairPlayTable(int season) {
        Tournament tournament = requireSeason(season);
        List<FootballMatch> matches =
            footballMatchRepository.findAllByTournamentIdWithMatchday(tournament.getId()).stream()
                .filter(m -> COUNTED.contains(m.getStatus()))
                .toList();

        Map<UUID, Agg> agg = new HashMap<>();
        for (FootballMatch match : matches) {
            MatchStats stats = matchStatsRepository.findById(match.getId()).orElse(null);
            if (stats == null) {
                continue;
            }
            add(agg, match.getHomeId(), n(stats.getHomeFouls()), n(stats.getHomeOffsides()));
            add(agg, match.getAwayId(), n(stats.getAwayFouls()), n(stats.getAwayOffsides()));
        }

        Map<UUID, Player> players =
            playerRepository.findAllById(agg.keySet()).stream()
                .collect(java.util.stream.Collectors.toMap(Player::getId, p -> p));

        List<FairPlayRow> rows = new ArrayList<>();
        for (Map.Entry<UUID, Agg> e : agg.entrySet()) {
            Player p = players.get(e.getKey());
            rows.add(
                new FairPlayRow(
                    e.getKey(),
                    p != null ? p.getName() : e.getKey().toString(),
                    e.getValue().matches,
                    e.getValue().fouls,
                    e.getValue().offsides
                )
            );
        }
        rows.sort(
            Comparator.comparingInt(FairPlayRow::fouls)
                .thenComparingInt(FairPlayRow::offsides)
                .thenComparing(FairPlayRow::playerName, String.CASE_INSENSITIVE_ORDER)
        );
        return rows;
    }

    private static int n(Integer value) {
        return value != null ? value : 0;
    }

    private static void add(Map<UUID, Agg> agg, UUID playerId, int fouls, int offsides) {
        Agg a = agg.computeIfAbsent(playerId, id -> new Agg());
        a.matches++;
        a.fouls += fouls;
        a.offsides += offsides;
    }

    private static final class Agg {
        int matches;
        int fouls;
        int offsides;
    }

    private Tournament requireSeason(int season) {
        return tournamentRepository
            .findFirstBySeasonOrderByCreatedAtDesc(season)
            .orElseThrow(() -> new IllegalStateException("No tournament for season " + season));
    }
}
