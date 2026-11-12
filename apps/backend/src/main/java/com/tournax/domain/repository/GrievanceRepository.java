package com.tournax.domain.repository;

import com.tournax.domain.model.Grievance;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrievanceRepository extends JpaRepository<Grievance, UUID> {

    List<Grievance> findAllByTournamentIdOrderByCreatedAtDesc(UUID tournamentId);
}
