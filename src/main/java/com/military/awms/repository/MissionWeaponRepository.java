package com.military.awms.repository;

import com.military.awms.model.MissionWeapon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MissionWeaponRepository extends JpaRepository<MissionWeapon, Long> {
    List<MissionWeapon> findByMissionId(Long missionId);
}
