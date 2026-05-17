package com.military.awms.service;

import com.military.awms.dto.response.DashboardResponse;
import com.military.awms.model.AmmunitionStock;
import com.military.awms.model.AuditLog;
import com.military.awms.model.enums.*;
import com.military.awms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Dashboard analytics service providing summary statistics and chart data.
 */
@Service
public class DashboardService {

    @Autowired private WeaponRepository weaponRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private MaintenanceRequestRepository maintenanceRepo;
    @Autowired private AmmunitionStockRepository ammoRepo;
    @Autowired private MissionRepository missionRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private AuditService auditService;

    public DashboardResponse getDashboardStats() {
        // Weapon stats
        Map<String, Long> byType = new LinkedHashMap<>();
        weaponRepo.countByWeaponType().forEach(row -> byType.put((String) row[0], (Long) row[1]));

        Map<String, Long> byStatus = new LinkedHashMap<>();
        weaponRepo.countByStatusGrouped().forEach(row -> byStatus.put(row[0].toString(), (Long) row[1]));

        // Ammo alerts
        List<DashboardResponse.AmmoAlertResponse> ammoAlerts = ammoRepo.findLowStock().stream()
                .map(a -> DashboardResponse.AmmoAlertResponse.builder()
                        .id(a.getId()).name(a.getName()).caliber(a.getCaliber())
                        .quantity(a.getQuantity()).reorderThreshold(a.getReorderThreshold()).build())
                .collect(Collectors.toList());

        // Recent activity
        List<DashboardResponse.AuditLogResponse> recentActivity = auditService.getTop10Recent().stream()
                .map(log -> DashboardResponse.AuditLogResponse.builder()
                        .action(log.getAction()).entityType(log.getEntityType())
                        .entityId(log.getEntityId()).performedBy(log.getPerformedBy())
                        .timestamp(log.getTimestamp().toString()).build())
                .collect(Collectors.toList());

        Long totalAmmo = ammoRepo.getTotalQuantity();

        return DashboardResponse.builder()
                .totalWeapons(weaponRepo.count())
                .activeWeapons(weaponRepo.countByStatus(WeaponStatus.ACTIVE))
                .inactiveWeapons(weaponRepo.countByStatus(WeaponStatus.INACTIVE))
                .decommissionedWeapons(weaponRepo.countByStatus(WeaponStatus.DECOMMISSIONED))
                .totalAssignments(assignmentRepo.count())
                .activeAssignments(assignmentRepo.countByStatus(AssignmentStatus.ACTIVE))
                .overdueAssignments(assignmentRepo.countByStatus(AssignmentStatus.OVERDUE))
                .pendingMaintenance(maintenanceRepo.countByStatus(MaintenanceStatus.PENDING))
                .inProgressMaintenance(maintenanceRepo.countByStatus(MaintenanceStatus.IN_PROGRESS))
                .completedMaintenance(maintenanceRepo.countByStatus(MaintenanceStatus.COMPLETED))
                .totalAmmunition(totalAmmo != null ? totalAmmo : 0)
                .lowStockAmmo(ammoRepo.findLowStock().size())
                .totalMissions(missionRepo.count())
                .activeMissions(missionRepo.countByStatus(MissionStatus.ACTIVE))
                .totalUsers(userRepo.count())
                .weaponsByType(byType)
                .weaponsByStatus(byStatus)
                .recentActivity(recentActivity)
                .ammoAlerts(ammoAlerts)
                .build();
    }
}
