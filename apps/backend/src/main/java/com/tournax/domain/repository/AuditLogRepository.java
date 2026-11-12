package com.tournax.domain.repository;

import com.tournax.domain.model.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {}
