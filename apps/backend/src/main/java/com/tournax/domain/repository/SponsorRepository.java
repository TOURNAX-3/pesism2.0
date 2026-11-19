package com.tournax.domain.repository;

import com.tournax.domain.model.Sponsor;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SponsorRepository extends JpaRepository<Sponsor, UUID> {

    List<Sponsor> findAllByTournamentIdOrderByNameAsc(UUID tournamentId);

    Optional<Sponsor> findByTournamentIdAndBannerActiveTrue(UUID tournamentId);

    @Modifying(clearAutomatically = true)
    @Query("update Sponsor s set s.bannerActive = false where s.tournamentId = :tournamentId")
    void clearBannerForTournament(UUID tournamentId);
}