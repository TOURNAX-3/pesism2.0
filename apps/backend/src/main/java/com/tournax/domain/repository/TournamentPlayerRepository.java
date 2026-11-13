package com.tournax.domain.repository;

import com.tournax.domain.model.TournamentPlayer;
import com.tournax.domain.model.TournamentPlayerId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TournamentPlayerRepository extends JpaRepository<TournamentPlayer, TournamentPlayerId> {

    boolean existsByIdTournamentIdAndIdPlayerId(UUID tournamentId, UUID playerId);

    @Query("select count(tp) from TournamentPlayer tp where tp.id.tournamentId = :tournamentId")
    long countByTournamentId(@Param("tournamentId") UUID tournamentId);

  @Query(
        """
        select count(tp) from TournamentPlayer tp
        join tp.player p
        where tp.id.tournamentId = :tournamentId and p.emailVerifiedAt is not null
        """
    )
    long countEmailVerifiedByTournamentId(@Param("tournamentId") UUID tournamentId);

    @Query(
        "select count(tp) from TournamentPlayer tp where tp.id.tournamentId = :tournamentId and tp.approved = true"
    )
    long countApprovedByTournamentId(@Param("tournamentId") UUID tournamentId);

    @Query(
        """
        select tp from TournamentPlayer tp
        join fetch tp.player p
        where tp.id.tournamentId = :tournamentId
        order by tp.joinedAt desc
        """
    )
    List<TournamentPlayer> findAllByTournamentIdWithPlayer(@Param("tournamentId") UUID tournamentId);

    @Query(
        """
        select tp from TournamentPlayer tp
        join fetch tp.player p
        where tp.id.tournamentId = :tournamentId and tp.approved = true
        order by p.name
        """
    )
    List<TournamentPlayer> findApprovedByTournamentIdWithPlayer(@Param("tournamentId") UUID tournamentId);

    @Query(
        """
        select tp from TournamentPlayer tp
        join fetch tp.player p
        where tp.id.tournamentId = :tournamentId
          and tp.id.playerId = :playerId
          and tp.approved = true
        """
    )
    Optional<TournamentPlayer> findApprovedEntry(
        @Param("tournamentId") UUID tournamentId,
        @Param("playerId") UUID playerId
    );
}
