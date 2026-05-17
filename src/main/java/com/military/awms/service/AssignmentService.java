package com.military.awms.service;

import com.military.awms.dto.request.AssignmentRequest;
import com.military.awms.exception.ResourceNotFoundException;
import com.military.awms.model.Assignment;
import com.military.awms.model.User;
import com.military.awms.model.Weapon;
import com.military.awms.model.enums.AssignmentStatus;
import com.military.awms.repository.AssignmentRepository;
import com.military.awms.repository.UserRepository;
import com.military.awms.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing weapon assignments to soldiers.
 * Tracks the full lifecycle: assignment → return/overdue/lost.
 */
@Service
@Transactional
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private WeaponRepository weaponRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
    }

    public List<Assignment> getAssignmentsByUser(Long userId) {
        return assignmentRepository.findByAssignedToId(userId);
    }

    public List<Assignment> getAssignmentsByStatus(String status) {
        return assignmentRepository.findByStatus(AssignmentStatus.valueOf(status.toUpperCase()));
    }

    /** Create a new weapon assignment */
    public Assignment createAssignment(AssignmentRequest request) {
        Weapon weapon = weaponRepository.findById(request.getWeaponId())
                .orElseThrow(() -> new ResourceNotFoundException("Weapon", "id", request.getWeaponId()));

        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));

        // Get the current authenticated user as the assigner
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User assignedBy = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));

        Assignment assignment = Assignment.builder()
                .weapon(weapon)
                .assignedTo(assignedTo)
                .assignedBy(assignedBy)
                .assignmentDate(request.getAssignmentDate())
                .expectedReturnDate(request.getExpectedReturnDate())
                .conditionOnIssue(request.getConditionOnIssue() != null ? request.getConditionOnIssue() : "GOOD")
                .status(AssignmentStatus.ACTIVE)
                .notes(request.getNotes())
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        auditService.logAction("CREATE", "Assignment", saved.getId(), null,
                "Weapon '" + weapon.getName() + "' assigned to " + assignedTo.getFullName());

        return saved;
    }

    /** Update an assignment (e.g., mark as returned) */
    public Assignment updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = getAssignmentById(id);
        String oldStatus = assignment.getStatus().toString();

        if (request.getActualReturnDate() != null) {
            assignment.setActualReturnDate(request.getActualReturnDate());
        }
        if (request.getConditionOnReturn() != null) {
            assignment.setConditionOnReturn(request.getConditionOnReturn());
        }
        if (request.getStatus() != null) {
            assignment.setStatus(AssignmentStatus.valueOf(request.getStatus().toUpperCase()));
        }
        if (request.getExpectedReturnDate() != null) {
            assignment.setExpectedReturnDate(request.getExpectedReturnDate());
        }
        if (request.getNotes() != null) {
            assignment.setNotes(request.getNotes());
        }

        Assignment updated = assignmentRepository.save(assignment);

        auditService.logAction("UPDATE", "Assignment", id,
                "Status was: " + oldStatus,
                "Status now: " + updated.getStatus());

        return updated;
    }

    /** Delete an assignment */
    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);
        auditService.logAction("DELETE", "Assignment", id,
                "Deleted assignment for weapon: " + assignment.getWeapon().getName(), null);
        assignmentRepository.delete(assignment);
    }
}
