package com.military.awms.model.enums;

/**
 * Tracks the status of a weapon assignment to a soldier.
 */
public enum AssignmentStatus {
    ACTIVE,     // Weapon is currently assigned
    RETURNED,   // Weapon has been returned
    OVERDUE,    // Weapon return is past the expected date
    LOST        // Weapon has been reported lost
}
