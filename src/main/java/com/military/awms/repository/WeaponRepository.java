package com.military.awms.repository;

import com.military.awms.model.Weapon;
import com.military.awms.model.enums.WeaponStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Weapon entity with custom inventory queries.
 */
@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long> {
    Optional<Weapon> findBySerialNumber(String serialNumber);
    List<Weapon> findByStatus(WeaponStatus status);
    List<Weapon> findByWeaponType(String weaponType);
    List<Weapon> findByCategoryId(Long categoryId);
    long countByStatus(WeaponStatus status);
    boolean existsBySerialNumber(String serialNumber);

    @Query("SELECT w.weaponType, COUNT(w) FROM Weapon w GROUP BY w.weaponType")
    List<Object[]> countByWeaponType();

    @Query("SELECT w.status, COUNT(w) FROM Weapon w GROUP BY w.status")
    List<Object[]> countByStatusGrouped();

    List<Weapon> findByNameContainingIgnoreCaseOrSerialNumberContainingIgnoreCase(String name, String serial);
}
