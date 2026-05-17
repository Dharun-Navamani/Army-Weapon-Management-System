package com.military.awms.service;

import com.military.awms.dto.request.MaintenanceRequestDto;
import com.military.awms.exception.ResourceNotFoundException;
import com.military.awms.model.MaintenanceRequest;
import com.military.awms.model.User;
import com.military.awms.model.Weapon;
import com.military.awms.model.enums.MaintenanceStatus;
import com.military.awms.model.enums.Priority;
import com.military.awms.repository.MaintenanceRequestRepository;
import com.military.awms.repository.UserRepository;
import com.military.awms.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing weapon maintenance and repair requests.
 */
@Service
@Transactional
public class MaintenanceService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private WeaponRepository weaponRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public List<MaintenanceRequest> getAllRequests() {
        return maintenanceRequestRepository.findAll();
    }

    public MaintenanceRequest getRequestById(Long id) {
        return maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MaintenanceRequest", "id", id));
    }

    public List<MaintenanceRequest> getRequestsByStatus(String status) {
        return maintenanceRequestRepository.findByStatus(MaintenanceStatus.valueOf(status.toUpperCase()));
    }

    /** Create a new maintenance request */
    public MaintenanceRequest createRequest(MaintenanceRequestDto dto) {
        Weapon weapon = weaponRepository.findById(dto.getWeaponId())
                .orElseThrow(() -> new ResourceNotFoundException("Weapon", "id", dto.getWeaponId()));

        // Get the current authenticated user as the requester
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User requestedBy = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));

        User assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAssignedToId()));
        }

        MaintenanceRequest request = MaintenanceRequest.builder()
                .weapon(weapon)
                .requestedBy(requestedBy)
                .assignedTo(assignedTo)
                .issueDescription(dto.getIssueDescription())
                .priority(dto.getPriority() != null ? Priority.valueOf(dto.getPriority().toUpperCase()) : Priority.MEDIUM)
                .status(dto.getStatus() != null ? MaintenanceStatus.valueOf(dto.getStatus().toUpperCase()) : MaintenanceStatus.PENDING)
                .resolutionNotes(dto.getResolutionNotes())
                .requestedDate(LocalDateTime.now())
                .build();

        MaintenanceRequest saved = maintenanceRequestRepository.save(request);

        auditService.logAction("CREATE", "MaintenanceRequest", saved.getId(), null,
                "Maintenance request created for weapon: " + weapon.getName());

        return saved;
    }

    /** Update an existing maintenance request */
    public MaintenanceRequest updateRequest(Long id, MaintenanceRequestDto dto) {
        MaintenanceRequest request = getRequestById(id);
        String oldStatus = request.getStatus().toString();

        if (dto.getWeaponId() != null) {
            Weapon weapon = weaponRepository.findById(dto.getWeaponId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weapon", "id", dto.getWeaponId()));
            request.setWeapon(weapon);
        }

        if (dto.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAssignedToId()));
            request.setAssignedTo(assignedTo);
        } else {
            request.setAssignedTo(null);
        }

        if (dto.getIssueDescription() != null) {
            request.setIssueDescription(dto.getIssueDescription());
        }

        if (dto.getPriority() != null) {
            request.setPriority(Priority.valueOf(dto.getPriority().toUpperCase()));
        }

        if (dto.getStatus() != null) {
            MaintenanceStatus newStatus = MaintenanceStatus.valueOf(dto.getStatus().toUpperCase());
            request.setStatus(newStatus);
            if (newStatus == MaintenanceStatus.COMPLETED) {
                request.setCompletedDate(LocalDateTime.now());
            }
        }

        if (dto.getResolutionNotes() != null) {
            request.setResolutionNotes(dto.getResolutionNotes());
        }

        MaintenanceRequest updated = maintenanceRequestRepository.save(request);

        auditService.logAction("UPDATE", "MaintenanceRequest", id,
                "Status was: " + oldStatus,
                "Status now: " + updated.getStatus());

        return updated;
    }

    /** Delete a maintenance request */
    public void deleteRequest(Long id) {
        MaintenanceRequest request = getRequestById(id);
        auditService.logAction("DELETE", "MaintenanceRequest", id,
                "Deleted request for weapon: " + request.getWeapon().getName(), null);
        maintenanceRequestRepository.delete(request);
    }
}
