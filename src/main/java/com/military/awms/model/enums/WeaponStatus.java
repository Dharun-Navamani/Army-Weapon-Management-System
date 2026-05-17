package com.military.awms.model.enums;

/**
 * Represents the lifecycle status of a weapon in the inventory.
 */
public enum WeaponStatus {
    ACTIVE,             // Weapon is operational and available
    INACTIVE,           // Weapon is temporarily out of service
    DECOMMISSIONED      // Weapon has been permanently retired
}
