package com.military.awms.model.enums;

/**
 * Tracks the progress of a maintenance/repair request.
 */
public enum MaintenanceStatus {
    PENDING,        // Request submitted, awaiting assignment
    IN_PROGRESS,    // Armourer is actively working on the repair
    COMPLETED,      // Maintenance finished successfully
    CANCELLED       // Request was cancelled
}
