package com.tournax.domain.repository;

import com.tournax.domain.model.MatchStats;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchStatsRepository extends JpaRepository<MatchStats, UUID> {}
