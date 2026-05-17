package com.military.awms.controller;

import com.military.awms.dto.request.MaintenanceRequestDto;
import com.military.awms.dto.response.ApiResponse;
import com.military.awms.model.MaintenanceRequest;
import com.military.awms.service.MaintenanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Maintenance", description = "Weapon maintenance request management")
@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceRequest>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getRequestById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MaintenanceRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(maintenanceService.getRequestsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@Valid @RequestBody MaintenanceRequestDto dto) {
        return ResponseEntity.ok(maintenanceService.createRequest(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<MaintenanceRequest> update(@PathVariable Long id, @Valid @RequestBody MaintenanceRequestDto dto) {
        return ResponseEntity.ok(maintenanceService.updateRequest(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        maintenanceService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance request deleted"));
    }
}
