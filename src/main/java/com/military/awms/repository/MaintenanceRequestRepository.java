package com.military.awms.repository;

import com.military.awms.model.MaintenanceRequest;
import com.military.awms.model.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for MaintenanceRequest entity.
 */
@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStatus(MaintenanceStatus status);
    List<MaintenanceRequest> findByRequestedById(Long userId);
    List<MaintenanceRequest> findByWeaponId(Long weaponId);
    long countByStatus(MaintenanceStatus status);
}
