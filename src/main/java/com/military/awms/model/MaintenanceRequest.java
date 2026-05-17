package com.military.awms.model;

import com.military.awms.model.enums.MaintenanceStatus;
import com.military.awms.model.enums.Priority;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * MaintenanceRequest entity for tracking weapon repair/service requests.
 * 
 * Soldiers or officers can submit maintenance requests for weapons.
 * Requests are assigned to armourers and tracked through their lifecycle
 * from PENDING → IN_PROGRESS → COMPLETED/CANCELLED.
 */
@Entity
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The weapon requiring maintenance */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "weapon_id", nullable = false)
    private Weapon weapon;

    /** The user who submitted the maintenance request */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    /** The armourer assigned to perform the maintenance */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "issue_description", nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MaintenanceStatus status = MaintenanceStatus.PENDING;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "requested_date")
    private LocalDateTime requestedDate;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.requestedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
