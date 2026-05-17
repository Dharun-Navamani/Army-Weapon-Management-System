package com.military.awms.config;

import com.military.awms.model.Role;
import com.military.awms.model.User;
import com.military.awms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Database initializer that seeds roles and default users on application startup.
 * Only inserts data if the database is empty (prevents duplicate entries).
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WeaponCategoryRepository weaponCategoryRepository;

    @Autowired
    private WeaponRepository weaponRepository;

    @Autowired
    private AmmunitionStockRepository ammunitionStockRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private MissionRepository missionRepository;

    @Autowired
    private com.military.awms.service.AuditService auditService;

    @Override
    public void run(String... args) {
        // Seed roles if they don't exist
        createRoleIfNotFound("ROLE_ADMIN", "Full system access - CRUD all modules");
        createRoleIfNotFound("ROLE_OFFICER", "View + request weapons, manage missions");
        createRoleIfNotFound("ROLE_SOLDIER", "View assigned weapons, request maintenance");

        // Seed default users if no users exist
        if (userRepository.count() == 0) {
            logger.info("Seeding default users...");

            User admin = createUser("admin", "password123", "Col. Rajesh Kumar",
                    "admin@army.mil", "+91-9876543210", "Colonel", "HQ Command", "ROLE_ADMIN");

            User officer1 = createUser("officer1", "password123", "Maj. Vikram Singh",
                    "vikram@army.mil", "+91-9876543211", "Major", "4th Infantry Division", "ROLE_OFFICER");

            User officer2 = createUser("officer2", "password123", "Capt. Priya Sharma",
                    "priya@army.mil", "+91-9876543212", "Captain", "7th Armored Brigade", "ROLE_OFFICER");

            User soldier1 = createUser("soldier1", "password123", "Hav. Amit Yadav",
                    "amit@army.mil", "+91-9876543213", "Havildar", "4th Infantry Division", "ROLE_SOLDIER");

            User soldier2 = createUser("soldier2", "password123", "Sep. Ravi Patel",
                    "ravi@army.mil", "+91-9876543214", "Sepoy", "7th Armored Brigade", "ROLE_SOLDIER");

            logger.info("Default users seeded successfully! Seeding inventory and operation data...");

            // 1. Seed Weapon Categories
            com.military.awms.model.WeaponCategory assaultRifles = weaponCategoryRepository.save(
                    com.military.awms.model.WeaponCategory.builder()
                            .name("Assault Rifles")
                            .description("Standard-issue infantry assault rifles")
                            .build()
            );
            com.military.awms.model.WeaponCategory sniperRifles = weaponCategoryRepository.save(
                    com.military.awms.model.WeaponCategory.builder()
                            .name("Sniper Rifles")
                            .description("High-precision long-range rifles")
                            .build()
            );
            com.military.awms.model.WeaponCategory pistols = weaponCategoryRepository.save(
                    com.military.awms.model.WeaponCategory.builder()
                            .name("Pistols")
                            .description("Secondary sidearms for officers and special ops")
                            .build()
            );
            com.military.awms.model.WeaponCategory machineGuns = weaponCategoryRepository.save(
                    com.military.awms.model.WeaponCategory.builder()
                            .name("Machine Guns")
                            .description("Heavy automatic squad support weapons")
                            .build()
            );

            // 2. Seed Weapons
            com.military.awms.model.Weapon w1 = weaponRepository.save(
                    com.military.awms.model.Weapon.builder()
                            .name("INSAS Rifle")
                            .serialNumber("INSAS-556-9821")
                            .weaponType("Assault Rifle")
                            .caliber("5.56x45mm NATO")
                            .manufacturer("Ordnance Factory Board")
                            .quantity(120)
                            .status(com.military.awms.model.enums.WeaponStatus.ACTIVE)
                            .category(assaultRifles)
                            .description("Indian Small Arms System standard infantry rifle")
                            .build()
            );

            com.military.awms.model.Weapon w2 = weaponRepository.save(
                    com.military.awms.model.Weapon.builder()
                            .name("SIG Sauer 716")
                            .serialNumber("SIG-716-1192")
                            .weaponType("Battle Rifle")
                            .caliber("7.62x51mm NATO")
                            .manufacturer("SIG Sauer")
                            .quantity(45)
                            .status(com.military.awms.model.enums.WeaponStatus.ACTIVE)
                            .category(assaultRifles)
                            .description("Modern frontline battle rifle with high stopping power")
                            .build()
            );

            com.military.awms.model.Weapon w3 = weaponRepository.save(
                    com.military.awms.model.Weapon.builder()
                            .name("Glock 17 Gen 5")
                            .serialNumber("GLK-919-4820")
                            .weaponType("Pistol")
                            .caliber("9x19mm Parabellum")
                            .manufacturer("Glock Ges.m.b.H.")
                            .quantity(80)
                            .status(com.military.awms.model.enums.WeaponStatus.ACTIVE)
                            .category(pistols)
                            .description("Reliable polymer-framed service sidearm")
                            .build()
            );

            com.military.awms.model.Weapon w4 = weaponRepository.save(
                    com.military.awms.model.Weapon.builder()
                            .name("Dragunov SVD")
                            .serialNumber("SVD-762-0941")
                            .weaponType("Sniper Rifle")
                            .caliber("7.62x54mmR")
                            .manufacturer("Kalashnikov Concern")
                            .quantity(15)
                            .status(com.military.awms.model.enums.WeaponStatus.ACTIVE)
                            .category(sniperRifles)
                            .description("Semi-automatic designated marksman sniper rifle")
                            .build()
            );

            com.military.awms.model.Weapon w5 = weaponRepository.save(
                    com.military.awms.model.Weapon.builder()
                            .name("FN Minimi")
                            .serialNumber("M249-556-3849")
                            .weaponType("Light Machine Gun")
                            .caliber("5.56x45mm NATO")
                            .manufacturer("FN Herstal")
                            .quantity(8)
                            .status(com.military.awms.model.enums.WeaponStatus.ACTIVE)
                            .category(machineGuns)
                            .description("Squad automatic weapon for heavy fire support")
                            .build()
            );

            // 3. Seed Ammunition Stocks
            ammunitionStockRepository.save(
                    com.military.awms.model.AmmunitionStock.builder()
                            .name("5.56mm NATO FMJ")
                            .caliber("5.56x45mm NATO")
                            .ammoType("Ball / FMJ")
                            .quantity(25000)
                            .reorderThreshold(5000)
                            .status(com.military.awms.model.enums.AmmoStatus.IN_STOCK)
                            .lastRestocked(java.time.LocalDateTime.now())
                            .location("Storage Locker A1")
                            .build()
            );

            ammunitionStockRepository.save(
                    com.military.awms.model.AmmunitionStock.builder()
                            .name("7.62mm AP Cartridges")
                            .caliber("7.62x51mm NATO")
                            .ammoType("AP (Armor Piercing)")
                            .quantity(1200) // LOW STOCK ALERT!
                            .reorderThreshold(3000)
                            .status(com.military.awms.model.enums.AmmoStatus.LOW_STOCK)
                            .lastRestocked(java.time.LocalDateTime.now())
                            .location("Storage Locker B3")
                            .build()
            );

            ammunitionStockRepository.save(
                    com.military.awms.model.AmmunitionStock.builder()
                            .name("9mm Parabellum FMJ")
                            .caliber("9x19mm Parabellum")
                            .ammoType("FMJ Sidearm Ammo")
                            .quantity(8500)
                            .reorderThreshold(2000)
                            .status(com.military.awms.model.enums.AmmoStatus.IN_STOCK)
                            .lastRestocked(java.time.LocalDateTime.now())
                            .location("Storage Locker A3")
                            .build()
            );

            ammunitionStockRepository.save(
                    com.military.awms.model.AmmunitionStock.builder()
                            .name("7.62mm Sniper Precision")
                            .caliber("7.62x54mmR")
                            .ammoType("Sniper Precision Match")
                            .quantity(350) // CRITICAL LOW STOCK!
                            .reorderThreshold(500)
                            .status(com.military.awms.model.enums.AmmoStatus.LOW_STOCK)
                            .lastRestocked(java.time.LocalDateTime.now())
                            .location("Sniper Base Depot")
                            .build()
            );

            // 4. Seed Assignments
            assignmentRepository.save(
                    com.military.awms.model.Assignment.builder()
                            .weapon(w1)
                            .assignedTo(soldier1)
                            .assignedBy(officer1)
                            .assignmentDate(java.time.LocalDate.now().minusDays(5))
                            .expectedReturnDate(java.time.LocalDate.now().plusDays(25))
                            .conditionOnIssue("EXCELLENT")
                            .status(com.military.awms.model.enums.AssignmentStatus.ACTIVE)
                            .notes("Assigned for standard border patrolling duty")
                            .build()
            );

            assignmentRepository.save(
                    com.military.awms.model.Assignment.builder()
                            .weapon(w3)
                            .assignedTo(soldier2)
                            .assignedBy(officer2)
                            .assignmentDate(java.time.LocalDate.now().minusDays(12))
                            .expectedReturnDate(java.time.LocalDate.now().minusDays(2)) // OVERDUE!
                            .conditionOnIssue("GOOD")
                            .status(com.military.awms.model.enums.AssignmentStatus.OVERDUE)
                            .notes("Standard sidearm issue for convoy duty")
                            .build()
            );

            // 5. Seed Maintenance Requests
            maintenanceRequestRepository.save(
                    com.military.awms.model.MaintenanceRequest.builder()
                            .weapon(w2)
                            .requestedBy(soldier1)
                            .assignedTo(admin) // Admin acts as armorer/maintainer
                            .issueDescription("Gas plug assembly jammed during firing drills")
                            .priority(com.military.awms.model.enums.Priority.HIGH)
                            .status(com.military.awms.model.enums.MaintenanceStatus.IN_PROGRESS)
                            .requestedDate(java.time.LocalDateTime.now().minusDays(2))
                            .build()
            );

            maintenanceRequestRepository.save(
                    com.military.awms.model.MaintenanceRequest.builder()
                            .weapon(w4)
                            .requestedBy(soldier2)
                            .assignedTo(admin)
                            .issueDescription("Optic scope calibration required (drifting 2 MOA right)")
                            .priority(com.military.awms.model.enums.Priority.CRITICAL)
                            .status(com.military.awms.model.enums.MaintenanceStatus.PENDING)
                            .requestedDate(java.time.LocalDateTime.now().minusHours(4))
                            .build()
            );

            // 6. Seed Missions
            missionRepository.save(
                    com.military.awms.model.Mission.builder()
                            .missionName("Operation Desert Shield")
                            .missionCode("ODS-2026")
                            .description("Anti-infiltration tactical patrolling in sector 4")
                            .location("Thar Desert Border Command")
                            .startDate(java.time.LocalDate.now().minusDays(1))
                            .endDate(java.time.LocalDate.now().plusDays(10))
                            .commandingOfficer(officer1)
                            .status(com.military.awms.model.enums.MissionStatus.ACTIVE)
                            .build()
            );

            missionRepository.save(
                    com.military.awms.model.Mission.builder()
                            .missionName("Operation Snow Falcon")
                            .missionCode("OSF-9821")
                            .description("High altitude forward post reinforcement and defense")
                            .location("Siachen Glacier Base")
                            .startDate(java.time.LocalDate.now().plusDays(15))
                            .endDate(java.time.LocalDate.now().plusDays(45))
                            .commandingOfficer(officer2)
                            .status(com.military.awms.model.enums.MissionStatus.PLANNED)
                            .build()
            );

            // Seed a few initial audit logs to auto-initialize the MongoDB Cloud collections
            auditService.logAction("CREATE", "Weapon", 1L, null, "{\"name\":\"INSAS Rifle\",\"serialNumber\":\"INS-982103\",\"caliber\":\"5.56x45mm NATO\",\"status\":\"ACTIVE\"}");
            auditService.logAction("CREATE", "Weapon", 2L, null, "{\"name\":\"SIG Sauer 716\",\"serialNumber\":\"SIG-110291\",\"caliber\":\"7.62x51mm NATO\",\"status\":\"ACTIVE\"}");
            auditService.logAction("CREATE", "Assignment", 1L, null, "{\"weaponId\":1,\"assignedTo\":\"soldier1\",\"assignedBy\":\"officer1\",\"status\":\"ACTIVE\"}");

            logger.info("Sample military inventory and tactical operations data seeded successfully!");
        }
    }

    private void createRoleIfNotFound(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            roleRepository.save(Role.builder().name(name).description(description).build());
            logger.info("Created role: {}", name);
        }
    }

    private User createUser(String username, String password, String fullName,
                           String email, String phone, String rank, String unit, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .rankTitle(rank)
                .unit(unit)
                .roles(roles)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        logger.info("Created user: {} ({})", username, roleName);
        return saved;
    }
}
