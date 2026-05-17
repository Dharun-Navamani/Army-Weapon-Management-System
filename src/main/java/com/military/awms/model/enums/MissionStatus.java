package com.military.awms.model.enums;

/**
 * Represents the current state of a military mission.
 */
public enum MissionStatus {
    PLANNED,    // Mission is scheduled but not yet started
    ACTIVE,     // Mission is currently underway
    COMPLETED,  // Mission has been successfully completed
    ABORTED     // Mission was cancelled or terminated early
}
