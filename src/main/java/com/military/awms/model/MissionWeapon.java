package com.military.awms.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * MissionWeapon join entity tracking which weapons and soldiers
 * are involved in each mission, along with quantity used.
 */
@Entity
@Table(name = "mission_weapons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissionWeapon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "weapon_id", nullable = false)
    private Weapon weapon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "soldier_id")
    private User soldier;

    @Column(name = "quantity_used")
    @Builder.Default
    private Integer quantityUsed = 1;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
