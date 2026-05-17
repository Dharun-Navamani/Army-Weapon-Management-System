package com.military.awms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * MongoDB document entity representing an Audit Log.
 * 
 * Used for polyglot NoSQL compliance tracking alongside SQL/H2 in-memory.
 */
@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoAuditLog {

    @Id
    private String id;

    private String action;
    private String entityType;
    private Long entityId;
    private String performedBy;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private LocalDateTime timestamp;
}
