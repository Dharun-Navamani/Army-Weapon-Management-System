package com.military.awms.service;

import com.military.awms.dto.request.MissionRequest;
import com.military.awms.exception.ResourceNotFoundException;
import com.military.awms.model.*;
import com.military.awms.model.enums.MissionStatus;
import com.military.awms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class MissionService {

    @Autowired private MissionRepository missionRepository;
    @Autowired private WeaponRepository weaponRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuditService auditService;

    public List<Mission> getAllMissions() { return missionRepository.findAll(); }

    public Mission getMissionById(Long id) {
        return missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mission", "id", id));
    }

    public List<Mission> getMissionsByStatus(String status) {
        return missionRepository.findByStatus(MissionStatus.valueOf(status.toUpperCase()));
    }

    public Mission createMission(MissionRequest req) {
        Mission mission = Mission.builder()
                .missionName(req.getMissionName())
                .missionCode(req.getMissionCode())
                .description(req.getDescription())
                .location(req.getLocation())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .status(req.getStatus() != null ? MissionStatus.valueOf(req.getStatus().toUpperCase()) : MissionStatus.PLANNED)
                .missionWeapons(new ArrayList<>())
                .build();

        if (req.getCommandingOfficerId() != null) {
            User officer = userRepository.findById(req.getCommandingOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", req.getCommandingOfficerId()));
            mission.setCommandingOfficer(officer);
        }

        // Add weapons to mission
        if (req.getWeapons() != null) {
            for (MissionRequest.MissionWeaponEntry entry : req.getWeapons()) {
                Weapon weapon = weaponRepository.findById(entry.getWeaponId())
                        .orElseThrow(() -> new ResourceNotFoundException("Weapon", "id", entry.getWeaponId()));
                MissionWeapon mw = MissionWeapon.builder()
                        .mission(mission).weapon(weapon)
                        .quantityUsed(entry.getQuantityUsed() != null ? entry.getQuantityUsed() : 1)
                        .notes(entry.getNotes()).build();
                if (entry.getSoldierId() != null) {
                    User soldier = userRepository.findById(entry.getSoldierId())
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", entry.getSoldierId()));
                    mw.setSoldier(soldier);
                }
                mission.getMissionWeapons().add(mw);
            }
        }

        Mission saved = missionRepository.save(mission);
        auditService.logAction("CREATE", "Mission", saved.getId(), null, "Created mission: " + saved.getMissionName());
        return saved;
    }

    public Mission updateMission(Long id, MissionRequest req) {
        Mission mission = getMissionById(id);
        if (req.getMissionName() != null) mission.setMissionName(req.getMissionName());
        if (req.getDescription() != null) mission.setDescription(req.getDescription());
        if (req.getLocation() != null) mission.setLocation(req.getLocation());
        if (req.getStartDate() != null) mission.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) mission.setEndDate(req.getEndDate());
        if (req.getStatus() != null) mission.setStatus(MissionStatus.valueOf(req.getStatus().toUpperCase()));
        Mission updated = missionRepository.save(mission);
        auditService.logAction("UPDATE", "Mission", id, null, "Updated: " + updated.getMissionName());
        return updated;
    }
}
