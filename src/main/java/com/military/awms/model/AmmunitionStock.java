package com.military.awms.model;

import com.military.awms.model.enums.AmmoStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * AmmunitionStock entity for tracking ammunition inventory.
 * 
 * Monitors ammo quantities by type and caliber with automatic
 * low-stock alerts when quantity drops below the reorder threshold.
 */
@Entity
@Table(name = "ammunition_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmmunitionStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "ammo_type", nullable = false, length = 50)
    private String ammoType;

    @Column(nullable = false, length = 30)
    private String caliber;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    /** Minimum quantity before triggering a low-stock alert */
    @Column(name = "reorder_threshold", nullable = false)
    @Builder.Default
    private Integer reorderThreshold = 100;

    @Column(name = "unit_of_measure", length = 20)
    @Builder.Default
    private String unitOfMeasure = "rounds";

    @Column(length = 100)
    private String location;

    @Column(name = "last_restocked")
    private LocalDateTime lastRestocked;

    /** Auto-calculated: IN_STOCK, LOW_STOCK, or OUT_OF_STOCK */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AmmoStatus status = AmmoStatus.IN_STOCK;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        updateStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        updateStatus();
    }

    /** Automatically updates stock status based on quantity vs threshold */
    private void updateStatus() {
        if (this.quantity <= 0) {
            this.status = AmmoStatus.OUT_OF_STOCK;
        } else if (this.quantity <= this.reorderThreshold) {
            this.status = AmmoStatus.LOW_STOCK;
        } else {
            this.status = AmmoStatus.IN_STOCK;
        }
    }
}
