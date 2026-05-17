package com.military.awms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating or updating mission entries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MissionRequest {

    @NotBlank(message = "Mission name is required")
    private String missionName;

    private String missionCode;

    private String description;
    private String location;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;
    private String status;  // PLANNED, ACTIVE, COMPLETED, ABORTED
    private Long commandingOfficerId;

    /** Weapons involved in this mission */
    private List<MissionWeaponEntry> weapons;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissionWeaponEntry {
        private Long weaponId;
        private Long soldierId;
        private Integer quantityUsed;
        private String notes;
    }
}
