package com.military.awms.repository;

import com.military.awms.model.MongoAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for MongoAuditLog document entity.
 */
@Repository
public interface MongoAuditLogRepository extends MongoRepository<MongoAuditLog, String> {

    List<MongoAuditLog> findByEntityType(String entityType);

    List<MongoAuditLog> findByPerformedBy(String performedBy);
}
