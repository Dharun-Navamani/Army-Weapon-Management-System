package com.military.awms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * WeaponCategory entity for classifying weapons into groups.
 * Examples: Assault Rifle, Sniper Rifle, Pistol, etc.
 */
@Entity
@Table(name = "weapon_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeaponCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
