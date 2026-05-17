package com.military.awms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating or updating ammunition stock entries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmmunitionRequest {

    @NotBlank(message = "Ammunition name is required")
    private String name;

    @NotBlank(message = "Ammo type is required")
    private String ammoType;

    @NotBlank(message = "Caliber is required")
    private String caliber;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Min(value = 1, message = "Reorder threshold must be at least 1")
    private Integer reorderThreshold;

    private String unitOfMeasure;
    private String location;
}
