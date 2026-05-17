package com.military.awms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * AuditLog entity for recording every CUD (Create/Update/Delete) operation.
 * 
 * Provides a comprehensive compliance trail showing who performed
 * what action, on which entity, at what time, including before/after values.
 */
@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The action performed: CREATE, UPDATE, DELETE */
    @Column(nullable = false, length = 20)
    private String action;

    /** The entity type affected: Weapon, Assignment, Mission, etc. */
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    /** The ID of the affected entity */
    @Column(name = "entity_id")
    private Long entityId;

    /** Username of the person who performed the action */
    @Column(name = "performed_by", nullable = false, length = 50)
    private String performedBy;

    /** JSON representation of the entity before the change */
    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    /** JSON representation of the entity after the change */
    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
