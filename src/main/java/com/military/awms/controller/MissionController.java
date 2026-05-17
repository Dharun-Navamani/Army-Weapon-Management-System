package com.military.awms.controller;

import com.military.awms.dto.request.MissionRequest;
import com.military.awms.model.Mission;
import com.military.awms.service.MissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Missions", description = "Mission log management")
@RestController
@RequestMapping("/api/missions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MissionController {

    @Autowired
    private MissionService missionService;

    @GetMapping
    public ResponseEntity<List<Mission>> getAll() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mission> getById(@PathVariable Long id) {
        return ResponseEntity.ok(missionService.getMissionById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Mission>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(missionService.getMissionsByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<Mission> create(@Valid @RequestBody MissionRequest request) {
        return ResponseEntity.ok(missionService.createMission(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<Mission> update(@PathVariable Long id, @Valid @RequestBody MissionRequest request) {
        return ResponseEntity.ok(missionService.updateMission(id, request));
    }
}
