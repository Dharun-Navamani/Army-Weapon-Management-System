package com.military.awms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

/**
 * Dashboard statistics response containing summary cards and chart data.
 * Powers the main dashboard view with real-time analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalWeapons;
    private long activeWeapons;
    private long inactiveWeapons;
    private long decommissionedWeapons;
    private long totalAssignments;
    private long activeAssignments;
    private long overdueAssignments;
    private long pendingMaintenance;
    private long inProgressMaintenance;
    private long completedMaintenance;
    private long totalAmmunition;
    private long lowStockAmmo;
    private long totalMissions;
    private long activeMissions;
    private long totalUsers;

    /** Data for weapon type distribution bar chart */
    private Map<String, Long> weaponsByType;

    /** Data for weapon status pie chart */
    private Map<String, Long> weaponsByStatus;

    /** Recent audit trail entries */
    private List<AuditLogResponse> recentActivity;

    /** Low stock ammunition alerts */
    private List<AmmoAlertResponse> ammoAlerts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AmmoAlertResponse {
        private Long id;
        private String name;
        private String caliber;
        private int quantity;
        private int reorderThreshold;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditLogResponse {
        private String action;
        private String entityType;
        private Long entityId;
        private String performedBy;
        private String timestamp;
    }
}
