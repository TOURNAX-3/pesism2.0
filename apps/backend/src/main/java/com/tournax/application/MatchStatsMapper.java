package com.tournax.application;

import com.tournax.application.dto.MatchStatsInput;
import com.tournax.domain.model.MatchStats;
import java.util.UUID;

final class MatchStatsMapper {

    private MatchStatsMapper() {}

    static void apply(UUID matchId, MatchStatsInput input, MatchStats target) {
        if (input == null) {
            return;
        }
        target.setHomePossessionPct(toShort(input.homePossessionPct()));
        target.setAwayPossessionPct(toShort(input.awayPossessionPct()));
        target.setHomeShots(input.homeShots());
        target.setAwayShots(input.awayShots());
        target.setHomeShotsOnTarget(input.homeShotsOnTarget());
        target.setAwayShotsOnTarget(input.awayShotsOnTarget());
        target.setHomeFouls(input.homeFouls());
        target.setAwayFouls(input.awayFouls());
        target.setHomeOffsides(input.homeOffsides());
        target.setAwayOffsides(input.awayOffsides());
        target.setHomeCornerKicks(input.homeCornerKicks());
        target.setAwayCornerKicks(input.awayCornerKicks());
        target.setHomeFreeKicks(input.homeFreeKicks());
        target.setAwayFreeKicks(input.awayFreeKicks());
        target.setHomePasses(input.homePasses());
        target.setAwayPasses(input.awayPasses());
        target.setHomeSuccessfulPasses(input.homeSuccessfulPasses());
        target.setAwaySuccessfulPasses(input.awaySuccessfulPasses());
        target.setHomeCrosses(input.homeCrosses());
        target.setAwayCrosses(input.awayCrosses());
        target.setHomeInterceptions(input.homeInterceptions());
        target.setAwayInterceptions(input.awayInterceptions());
        target.setHomeTackles(input.homeTackles());
        target.setAwayTackles(input.awayTackles());
        target.setHomeSaves(input.homeSaves());
        target.setAwaySaves(input.awaySaves());
    }

    static MatchStatsInput toInput(MatchStats stats) {
        if (stats == null) {
            return null;
        }
        return new MatchStatsInput(
            toInt(stats.getHomePossessionPct()),
            toInt(stats.getAwayPossessionPct()),
            stats.getHomeShots(),
            stats.getAwayShots(),
            stats.getHomeShotsOnTarget(),
            stats.getAwayShotsOnTarget(),
            stats.getHomeFouls(),
            stats.getAwayFouls(),
            stats.getHomeOffsides(),
            stats.getAwayOffsides(),
            stats.getHomeCornerKicks(),
            stats.getAwayCornerKicks(),
            stats.getHomeFreeKicks(),
            stats.getAwayFreeKicks(),
            stats.getHomePasses(),
            stats.getAwayPasses(),
            stats.getHomeSuccessfulPasses(),
            stats.getAwaySuccessfulPasses(),
            stats.getHomeCrosses(),
            stats.getAwayCrosses(),
            stats.getHomeInterceptions(),
            stats.getAwayInterceptions(),
            stats.getHomeTackles(),
            stats.getAwayTackles(),
            stats.getHomeSaves(),
            stats.getAwaySaves()
        );
    }

    private static Integer toInt(Short value) {
        return value == null ? null : value.intValue();
    }

    private static Short toShort(Integer value) {
        return value == null ? null : value.shortValue();
    }
}
