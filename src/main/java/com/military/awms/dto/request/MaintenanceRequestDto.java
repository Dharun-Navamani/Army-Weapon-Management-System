package com.military.awms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating or updating maintenance requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequestDto {

    @NotNull(message = "Weapon ID is required")
    private Long weaponId;

    private Long assignedToId;

    @NotBlank(message = "Issue description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String issueDescription;

    private String priority;   // LOW, MEDIUM, HIGH, CRITICAL
    private String status;     // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    private String resolutionNotes;
}
