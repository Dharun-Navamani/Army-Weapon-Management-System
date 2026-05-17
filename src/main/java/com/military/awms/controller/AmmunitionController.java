package com.military.awms.controller;

import com.military.awms.dto.request.AmmunitionRequest;
import com.military.awms.dto.response.ApiResponse;
import com.military.awms.model.AmmunitionStock;
import com.military.awms.service.AmmunitionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Ammunition", description = "Ammunition stock management")
@RestController
@RequestMapping("/api/ammunition")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AmmunitionController {

    @Autowired
    private AmmunitionService ammoService;

    @GetMapping
    public ResponseEntity<List<AmmunitionStock>> getAll() {
        return ResponseEntity.ok(ammoService.getAllStock());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmmunitionStock> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ammoService.getStockById(id));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<AmmunitionStock>> getLowStock() {
        return ResponseEntity.ok(ammoService.getLowStock());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<AmmunitionStock> create(@Valid @RequestBody AmmunitionRequest request) {
        return ResponseEntity.ok(ammoService.createStock(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<AmmunitionStock> update(@PathVariable Long id, @Valid @RequestBody AmmunitionRequest request) {
        return ResponseEntity.ok(ammoService.updateStock(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        ammoService.deleteStock(id);
        return ResponseEntity.ok(ApiResponse.success("Ammunition stock deleted"));
    }
}
