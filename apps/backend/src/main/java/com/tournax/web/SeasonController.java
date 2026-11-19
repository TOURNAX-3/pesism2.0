package com.tournax.web;

import com.tournax.application.CompetitionService;
import com.tournax.application.SponsorService;
import com.tournax.application.dto.CompetitionResponse;
import com.tournax.application.dto.MatchDetailResponse;
import com.tournax.application.dto.MatchHighlightDto;
import com.tournax.application.dto.SponsorDto;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/seasons/{season}")
public class SeasonController {

    private final CompetitionService competitionService;
    private final SponsorService sponsorService;

    public SeasonController(CompetitionService competitionService, SponsorService sponsorService) {
        this.competitionService = competitionService;
        this.sponsorService = sponsorService;
    }

    @GetMapping("/competition")
    public CompetitionResponse competition(@PathVariable int season) {
        return competitionService.getCompetition(season);
    }

    @GetMapping("/matches/{matchId}")
    public MatchDetailResponse matchDetail(@PathVariable int season, @PathVariable UUID matchId) {
        return competitionService.getMatchDetail(season, matchId);
    }

    @GetMapping("/highlights")
    public List<MatchHighlightDto> highlights(@PathVariable int season) {
        return competitionService.listMatchHighlights(season);
    }

    @GetMapping("/sponsors")
    public List<SponsorDto> sponsors(@PathVariable int season) {
        return sponsorService.listPublic(season);
    }

    @GetMapping("/sponsors/banner")
    public ResponseEntity<SponsorDto> sponsorBanner(@PathVariable int season) {
        SponsorDto dto = sponsorService.bannerSponsor(season);
        if (dto == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dto);
    }
}
