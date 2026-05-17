package com.military.awms.repository;

import com.military.awms.model.Assignment;
import com.military.awms.model.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Assignment entity with status-based queries.
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByStatus(AssignmentStatus status);
    List<Assignment> findByAssignedToId(Long userId);
    List<Assignment> findByWeaponId(Long weaponId);
    long countByStatus(AssignmentStatus status);
}
