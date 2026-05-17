-- ================================================================
-- ARMY WEAPON MANAGEMENT SYSTEM - Database Schema (MySQL 8)
-- ================================================================
-- This schema defines all tables for the AWMS application.
-- Hibernate ddl-auto=update manages schema evolution at runtime,
-- but this file serves as the canonical DDL reference.
-- ================================================================

CREATE DATABASE IF NOT EXISTS army_weapon_db;
USE army_weapon_db;

-- ==================== ROLES TABLE ====================
-- Stores system roles: ADMIN, OFFICER, SOLDIER
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================== USERS TABLE ====================
-- Stores all system users with encrypted passwords
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    rank_title VARCHAR(50),
    unit VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================== USER_ROLES JOIN TABLE ====================
-- Many-to-many relationship between users and roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================== WEAPON CATEGORIES TABLE ====================
-- Categories for classifying weapons (Assault Rifle, Sniper, etc.)
CREATE TABLE IF NOT EXISTS weapon_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================== WEAPONS TABLE ====================
-- Core weapon inventory with tracking details
CREATE TABLE IF NOT EXISTS weapons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(50) NOT NULL UNIQUE,
    category_id BIGINT,
    weapon_type VARCHAR(50) NOT NULL,
    caliber VARCHAR(30),
    manufacturer VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('ACTIVE', 'INACTIVE', 'DECOMMISSIONED') DEFAULT 'ACTIVE',
    image_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES weapon_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==================== ASSIGNMENTS TABLE ====================
-- Tracks weapon assignments to soldiers/units
CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    weapon_id BIGINT NOT NULL,
    assigned_to BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    assignment_date DATE NOT NULL,
    expected_return_date DATE,
    actual_return_date DATE,
    condition_on_issue VARCHAR(50) DEFAULT 'GOOD',
    condition_on_return VARCHAR(50),
    status ENUM('ACTIVE', 'RETURNED', 'OVERDUE', 'LOST') DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (weapon_id) REFERENCES weapons(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================== MAINTENANCE REQUESTS TABLE ====================
-- Tracks weapon maintenance and repair requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    weapon_id BIGINT NOT NULL,
    requested_by BIGINT NOT NULL,
    assigned_to BIGINT,
    issue_description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    resolution_notes TEXT,
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (weapon_id) REFERENCES weapons(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==================== AMMUNITION STOCK TABLE ====================
-- Tracks ammunition inventory with reorder alerts
CREATE TABLE IF NOT EXISTS ammunition_stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ammo_type VARCHAR(50) NOT NULL,
    caliber VARCHAR(30) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 100,
    unit_of_measure VARCHAR(20) DEFAULT 'rounds',
    location VARCHAR(100),
    last_restocked TIMESTAMP NULL,
    status ENUM('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK') DEFAULT 'IN_STOCK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================== MISSIONS TABLE ====================
-- Logs military missions with details
CREATE TABLE IF NOT EXISTS missions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mission_name VARCHAR(100) NOT NULL,
    mission_code VARCHAR(30) UNIQUE,
    description TEXT,
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'ABORTED') DEFAULT 'PLANNED',
    commanding_officer_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (commanding_officer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==================== MISSION_WEAPONS JOIN TABLE ====================
-- Tracks which weapons are used in each mission
CREATE TABLE IF NOT EXISTS mission_weapons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mission_id BIGINT NOT NULL,
    weapon_id BIGINT NOT NULL,
    soldier_id BIGINT,
    quantity_used INT DEFAULT 1,
    notes TEXT,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
    FOREIGN KEY (weapon_id) REFERENCES weapons(id) ON DELETE CASCADE,
    FOREIGN KEY (soldier_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==================== AUDIT LOGS TABLE ====================
-- Records every CUD operation for compliance tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(20) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    performed_by VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================== INDEXES FOR PERFORMANCE ====================
CREATE INDEX idx_weapons_status ON weapons(status);
CREATE INDEX idx_weapons_serial ON weapons(serial_number);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_ammo_caliber ON ammunition_stock(caliber);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
