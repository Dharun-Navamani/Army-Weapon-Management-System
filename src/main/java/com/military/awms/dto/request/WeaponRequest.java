package com.military.awms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating or updating a weapon in the inventory.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeaponRequest {

    @NotBlank(message = "Weapon name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Serial number is required")
    @Size(max = 50, message = "Serial number must not exceed 50 characters")
    private String serialNumber;

    private Long categoryId;

    @NotBlank(message = "Weapon type is required")
    private String weaponType;

    private String caliber;
    private String manufacturer;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private String status;  // ACTIVE, INACTIVE, DECOMMISSIONED
    private String imageUrl;
    private String description;
}
