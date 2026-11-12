package com.tournax.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "match_stats")
public class MatchStats {

    @Id
    @Column(name = "match_id")
    private UUID matchId;

    @Column(name = "home_possession_pct")
    private Short homePossessionPct;

    @Column(name = "away_possession_pct")
    private Short awayPossessionPct;

    @Column(name = "home_shots")
    private Integer homeShots;

    @Column(name = "away_shots")
    private Integer awayShots;

    @Column(name = "home_shots_on_target")
    private Integer homeShotsOnTarget;

    @Column(name = "away_shots_on_target")
    private Integer awayShotsOnTarget;

    @Column(name = "home_fouls")
    private Integer homeFouls;

    @Column(name = "away_fouls")
    private Integer awayFouls;

    @Column(name = "home_offsides")
    private Integer homeOffsides;

    @Column(name = "away_offsides")
    private Integer awayOffsides;

    @Column(name = "home_corner_kicks")
    private Integer homeCornerKicks;

    @Column(name = "away_corner_kicks")
    private Integer awayCornerKicks;

    @Column(name = "home_free_kicks")
    private Integer homeFreeKicks;

    @Column(name = "away_free_kicks")
    private Integer awayFreeKicks;

    @Column(name = "home_passes")
    private Integer homePasses;

    @Column(name = "away_passes")
    private Integer awayPasses;

    @Column(name = "home_successful_passes")
    private Integer homeSuccessfulPasses;

    @Column(name = "away_successful_passes")
    private Integer awaySuccessfulPasses;

    @Column(name = "home_crosses")
    private Integer homeCrosses;

    @Column(name = "away_crosses")
    private Integer awayCrosses;

    @Column(name = "home_interceptions")
    private Integer homeInterceptions;

    @Column(name = "away_interceptions")
    private Integer awayInterceptions;

    @Column(name = "home_tackles")
    private Integer homeTackles;

    @Column(name = "away_tackles")
    private Integer awayTackles;

    @Column(name = "home_saves")
    private Integer homeSaves;

    @Column(name = "away_saves")
    private Integer awaySaves;

    protected MatchStats() {}

    public static MatchStats forMatch(UUID matchId) {
        MatchStats stats = new MatchStats();
        stats.matchId = matchId;
        return stats;
    }

    public UUID getMatchId() {
        return matchId;
    }

    public Short getHomePossessionPct() {
        return homePossessionPct;
    }

    public Short getAwayPossessionPct() {
        return awayPossessionPct;
    }

    public Integer getHomeShots() {
        return homeShots;
    }

    public Integer getAwayShots() {
        return awayShots;
    }

    public Integer getHomeShotsOnTarget() {
        return homeShotsOnTarget;
    }

    public Integer getAwayShotsOnTarget() {
        return awayShotsOnTarget;
    }

    public Integer getHomeFouls() {
        return homeFouls;
    }

    public Integer getAwayFouls() {
        return awayFouls;
    }

    public Integer getHomeOffsides() {
        return homeOffsides;
    }

    public Integer getAwayOffsides() {
        return awayOffsides;
    }

    public Integer getHomeCornerKicks() {
        return homeCornerKicks;
    }

    public Integer getAwayCornerKicks() {
        return awayCornerKicks;
    }

    public Integer getHomeFreeKicks() {
        return homeFreeKicks;
    }

    public Integer getAwayFreeKicks() {
        return awayFreeKicks;
    }

    public Integer getHomePasses() {
        return homePasses;
    }

    public Integer getAwayPasses() {
        return awayPasses;
    }

    public Integer getHomeSuccessfulPasses() {
        return homeSuccessfulPasses;
    }

    public Integer getAwaySuccessfulPasses() {
        return awaySuccessfulPasses;
    }

    public Integer getHomeCrosses() {
        return homeCrosses;
    }

    public Integer getAwayCrosses() {
        return awayCrosses;
    }

    public Integer getHomeInterceptions() {
        return homeInterceptions;
    }

    public Integer getAwayInterceptions() {
        return awayInterceptions;
    }

    public Integer getHomeTackles() {
        return homeTackles;
    }

    public Integer getAwayTackles() {
        return awayTackles;
    }

    public Integer getHomeSaves() {
        return homeSaves;
    }

    public Integer getAwaySaves() {
        return awaySaves;
    }

    public void setHomePossessionPct(Short homePossessionPct) {
        this.homePossessionPct = homePossessionPct;
    }

    public void setAwayPossessionPct(Short awayPossessionPct) {
        this.awayPossessionPct = awayPossessionPct;
    }

    public void setHomeShots(Integer homeShots) {
        this.homeShots = homeShots;
    }

    public void setAwayShots(Integer awayShots) {
        this.awayShots = awayShots;
    }

    public void setHomeShotsOnTarget(Integer homeShotsOnTarget) {
        this.homeShotsOnTarget = homeShotsOnTarget;
    }

    public void setAwayShotsOnTarget(Integer awayShotsOnTarget) {
        this.awayShotsOnTarget = awayShotsOnTarget;
    }

    public void setHomeFouls(Integer homeFouls) {
        this.homeFouls = homeFouls;
    }

    public void setAwayFouls(Integer awayFouls) {
        this.awayFouls = awayFouls;
    }

    public void setHomeOffsides(Integer homeOffsides) {
        this.homeOffsides = homeOffsides;
    }

    public void setAwayOffsides(Integer awayOffsides) {
        this.awayOffsides = awayOffsides;
    }

    public void setHomeCornerKicks(Integer homeCornerKicks) {
        this.homeCornerKicks = homeCornerKicks;
    }

    public void setAwayCornerKicks(Integer awayCornerKicks) {
        this.awayCornerKicks = awayCornerKicks;
    }

    public void setHomeFreeKicks(Integer homeFreeKicks) {
        this.homeFreeKicks = homeFreeKicks;
    }

    public void setAwayFreeKicks(Integer awayFreeKicks) {
        this.awayFreeKicks = awayFreeKicks;
    }

    public void setHomePasses(Integer homePasses) {
        this.homePasses = homePasses;
    }

    public void setAwayPasses(Integer awayPasses) {
        this.awayPasses = awayPasses;
    }

    public void setHomeSuccessfulPasses(Integer homeSuccessfulPasses) {
        this.homeSuccessfulPasses = homeSuccessfulPasses;
    }

    public void setAwaySuccessfulPasses(Integer awaySuccessfulPasses) {
        this.awaySuccessfulPasses = awaySuccessfulPasses;
    }

    public void setHomeCrosses(Integer homeCrosses) {
        this.homeCrosses = homeCrosses;
    }

    public void setAwayCrosses(Integer awayCrosses) {
        this.awayCrosses = awayCrosses;
    }

    public void setHomeInterceptions(Integer homeInterceptions) {
        this.homeInterceptions = homeInterceptions;
    }

    public void setAwayInterceptions(Integer awayInterceptions) {
        this.awayInterceptions = awayInterceptions;
    }

    public void setHomeTackles(Integer homeTackles) {
        this.homeTackles = homeTackles;
    }

    public void setAwayTackles(Integer awayTackles) {
        this.awayTackles = awayTackles;
    }

    public void setHomeSaves(Integer homeSaves) {
        this.homeSaves = homeSaves;
    }

    public void setAwaySaves(Integer awaySaves) {
        this.awaySaves = awaySaves;
    }
}
