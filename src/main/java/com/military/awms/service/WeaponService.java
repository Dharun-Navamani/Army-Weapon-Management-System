package com.military.awms.service;

import com.military.awms.dto.request.WeaponRequest;
import com.military.awms.exception.BadRequestException;
import com.military.awms.exception.ResourceNotFoundException;
import com.military.awms.model.Weapon;
import com.military.awms.model.WeaponCategory;
import com.military.awms.model.enums.WeaponStatus;
import com.military.awms.repository.WeaponCategoryRepository;
import com.military.awms.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for weapon inventory management (CRUD + search + analytics).
 * Handles weapon lifecycle from creation to decommissioning.
 */
@Service
@Transactional
public class WeaponService {

    @Autowired
    private WeaponRepository weaponRepository;

    @Autowired
    private WeaponCategoryRepository categoryRepository;

    @Autowired
    private AuditService auditService;

    /** Get all weapons in the inventory */
    public List<Weapon> getAllWeapons() {
        return weaponRepository.findAll();
    }

    /** Get a specific weapon by ID */
    public Weapon getWeaponById(Long id) {
        return weaponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weapon", "id", id));
    }

    /** Search weapons by name or serial number */
    public List<Weapon> searchWeapons(String query) {
        return weaponRepository.findByNameContainingIgnoreCaseOrSerialNumberContainingIgnoreCase(query, query);
    }

    /** Get weapons by status */
    public List<Weapon> getWeaponsByStatus(String status) {
        return weaponRepository.findByStatus(WeaponStatus.valueOf(status.toUpperCase()));
    }

    /** Create a new weapon entry */
    public Weapon createWeapon(WeaponRequest request) {
        // Check for duplicate serial number
        if (weaponRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new BadRequestException("Serial number already exists: " + request.getSerialNumber());
        }

        Weapon weapon = mapToEntity(request, new Weapon());
        Weapon saved = weaponRepository.save(weapon);

        // Log audit trail
        auditService.logAction("CREATE", "Weapon", saved.getId(), null,
                "Created weapon: " + saved.getName() + " [" + saved.getSerialNumber() + "]");

        return saved;
    }

    /** Update an existing weapon */
    public Weapon updateWeapon(Long id, WeaponRequest request) {
        Weapon weapon = getWeaponById(id);
        String oldInfo = weapon.getName() + " [" + weapon.getSerialNumber() + "]";

        // Check serial number uniqueness (exclude current weapon)
        if (!weapon.getSerialNumber().equals(request.getSerialNumber()) &&
                weaponRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new BadRequestException("Serial number already exists: " + request.getSerialNumber());
        }

        mapToEntity(request, weapon);
        Weapon updated = weaponRepository.save(weapon);

        auditService.logAction("UPDATE", "Weapon", id, oldInfo,
                "Updated to: " + updated.getName() + " [" + updated.getSerialNumber() + "]");

        return updated;
    }

    /** Delete a weapon from inventory */
    public void deleteWeapon(Long id) {
        Weapon weapon = getWeaponById(id);
        auditService.logAction("DELETE", "Weapon", id,
                "Deleted weapon: " + weapon.getName() + " [" + weapon.getSerialNumber() + "]", null);
        weaponRepository.delete(weapon);
    }

    /** Get all weapon categories */
    public List<WeaponCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    /** Map request DTO to entity */
    private Weapon mapToEntity(WeaponRequest request, Weapon weapon) {
        weapon.setName(request.getName());
        weapon.setSerialNumber(request.getSerialNumber());
        weapon.setWeaponType(request.getWeaponType());
        weapon.setCaliber(request.getCaliber());
        weapon.setManufacturer(request.getManufacturer());
        weapon.setQuantity(request.getQuantity());
        weapon.setImageUrl(request.getImageUrl());
        weapon.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            weapon.setStatus(WeaponStatus.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getCategoryId() != null) {
            WeaponCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            weapon.setCategory(category);
        }

        return weapon;
    }
}
