package com.tournax.domain.repository;

import com.tournax.domain.model.GrievanceComment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrievanceCommentRepository extends JpaRepository<GrievanceComment, Long> {

    List<GrievanceComment> findAllByGrievanceIdOrderByCreatedAtAsc(UUID grievanceId);
}
