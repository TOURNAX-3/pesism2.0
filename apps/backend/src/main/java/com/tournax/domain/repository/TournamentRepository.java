package com.tournax.domain.repository;

import com.tournax.domain.model.Tournament;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, UUID> {
    Optional<Tournament> findFirstBySeasonOrderByCreatedAtDesc(int season);
}
