package com.military.awms.service;

import com.military.awms.model.AuditLog;
import com.military.awms.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing audit trail logs.
 * 
 * Records every CREATE, UPDATE, DELETE operation with the performing
 * user's identity, timestamp, and before/after values for compliance tracking.
 */
@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Log an audit event for any CUD operation.
     *
     * @param action     CREATE, UPDATE, or DELETE
     * @param entityType The entity class name (e.g., "Weapon", "Assignment")
     * @param entityId   The ID of the affected entity
     * @param oldValue   JSON string of the entity before the change (null for CREATE)
     * @param newValue   JSON string of the entity after the change (null for DELETE)
     */
    public void logAction(String action, String entityType, Long entityId,
                          String oldValue, String newValue) {
        String username = getCurrentUsername();

        AuditLog log = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .performedBy(username)
                .oldValue(oldValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }

    /** Get all audit logs ordered by most recent first */
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll(
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC, "timestamp"));
    }

    /** Get the most recent N audit logs */
    public List<AuditLog> getRecentLogs(int count) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, count));
    }

    /** Get the 10 most recent audit logs for the dashboard */
    public List<AuditLog> getTop10Recent() {
        return auditLogRepository.findTop10ByOrderByTimestampDesc();
    }

    /** Get audit logs filtered by entity type */
    public List<AuditLog> getLogsByEntity(String entityType) {
        return auditLogRepository.findByEntityType(entityType);
    }

    /** Get audit logs filtered by user */
    public List<AuditLog> getLogsByUser(String username) {
        return auditLogRepository.findByPerformedBy(username);
    }

    /** Get audit logs within a date range */
    public List<AuditLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampBetween(start, end);
    }

    /** Helper to get current authenticated username */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "SYSTEM";
    }
}
