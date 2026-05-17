package com.military.awms.controller;

import com.military.awms.dto.request.WeaponRequest;
import com.military.awms.dto.response.ApiResponse;
import com.military.awms.model.Weapon;
import com.military.awms.model.WeaponCategory;
import com.military.awms.service.WeaponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Weapons", description = "Weapon inventory CRUD operations")
@RestController
@RequestMapping("/api/weapons")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WeaponController {

    @Autowired
    private WeaponService weaponService;

    @Operation(summary = "Get all weapons")
    @GetMapping
    public ResponseEntity<List<Weapon>> getAll() {
        return ResponseEntity.ok(weaponService.getAllWeapons());
    }

    @Operation(summary = "Get weapon by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Weapon> getById(@PathVariable Long id) {
        return ResponseEntity.ok(weaponService.getWeaponById(id));
    }

    @Operation(summary = "Search weapons by name or serial number")
    @GetMapping("/search")
    public ResponseEntity<List<Weapon>> search(@RequestParam String query) {
        return ResponseEntity.ok(weaponService.searchWeapons(query));
    }

    @Operation(summary = "Get weapons by status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Weapon>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(weaponService.getWeaponsByStatus(status));
    }

    @Operation(summary = "Get all weapon categories")
    @GetMapping("/categories")
    public ResponseEntity<List<WeaponCategory>> getCategories() {
        return ResponseEntity.ok(weaponService.getAllCategories());
    }

    @Operation(summary = "Add a new weapon (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Weapon> create(@Valid @RequestBody WeaponRequest request) {
        return ResponseEntity.ok(weaponService.createWeapon(request));
    }

    @Operation(summary = "Update a weapon (Admin only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Weapon> update(@PathVariable Long id, @Valid @RequestBody WeaponRequest request) {
        return ResponseEntity.ok(weaponService.updateWeapon(id, request));
    }

    @Operation(summary = "Delete a weapon (Admin only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        weaponService.deleteWeapon(id);
        return ResponseEntity.ok(ApiResponse.success("Weapon deleted successfully"));
    }
}
