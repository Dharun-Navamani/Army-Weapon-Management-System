package com.military.awms.repository;

import com.military.awms.model.AmmunitionStock;
import com.military.awms.model.enums.AmmoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for AmmunitionStock entity with low-stock detection.
 */
@Repository
public interface AmmunitionStockRepository extends JpaRepository<AmmunitionStock, Long> {
    List<AmmunitionStock> findByStatus(AmmoStatus status);
    List<AmmunitionStock> findByCaliber(String caliber);

    /** Find all ammo where quantity is at or below the reorder threshold */
    @Query("SELECT a FROM AmmunitionStock a WHERE a.quantity <= a.reorderThreshold")
    List<AmmunitionStock> findLowStock();

    @Query("SELECT SUM(a.quantity) FROM AmmunitionStock a")
    Long getTotalQuantity();
}
