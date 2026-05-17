package com.military.awms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO for creating or updating weapon assignments.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    @NotNull(message = "Weapon ID is required")
    private Long weaponId;

    @NotNull(message = "Assigned-to user ID is required")
    private Long assignedToId;

    @NotNull(message = "Assignment date is required")
    private LocalDate assignmentDate;

    private LocalDate expectedReturnDate;
    private LocalDate actualReturnDate;
    private String conditionOnIssue;
    private String conditionOnReturn;
    private String status;  // ACTIVE, RETURNED, OVERDUE, LOST
    private String notes;
}
