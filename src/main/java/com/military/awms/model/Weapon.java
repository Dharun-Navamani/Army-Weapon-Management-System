package com.military.awms.model;

import com.military.awms.model.enums.WeaponStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Weapon entity - the core entity of the system.
 * 
 * Tracks individual weapons in the military inventory with details
 * including serial number, type, caliber, manufacturer, status,
 * and current quantity available.
 */
@Entity
@Table(name = "weapons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Weapon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "serial_number", nullable = false, unique = true, length = 50)
    private String serialNumber;

    /** Category relationship - e.g., Assault Rifle, Sniper, Pistol */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private WeaponCategory category;

    @Column(name = "weapon_type", nullable = false, length = 50)
    private String weaponType;

    @Column(length = 30)
    private String caliber;

    @Column(length = 100)
    private String manufacturer;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    /** Weapon lifecycle status: ACTIVE, INACTIVE, or DECOMMISSIONED */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WeaponStatus status = WeaponStatus.ACTIVE;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
