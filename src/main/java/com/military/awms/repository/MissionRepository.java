package com.military.awms.repository;

import com.military.awms.model.Mission;
import com.military.awms.model.enums.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Mission entity.
 */
@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByStatus(MissionStatus status);
    Optional<Mission> findByMissionCode(String missionCode);
    long countByStatus(MissionStatus status);
}
