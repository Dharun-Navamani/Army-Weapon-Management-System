-- ================================================================
-- ARMY WEAPON MANAGEMENT SYSTEM - Seed Data
-- ================================================================
-- Run this AFTER schema creation. Passwords are BCrypt-encoded.
-- Default password for all users: "password123"
-- ================================================================

-- ==================== SEED ROLES ====================
INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Full system access - CRUD all modules'),
(2, 'ROLE_OFFICER', 'View + request weapons, manage missions'),
(3, 'ROLE_SOLDIER', 'View assigned weapons, request maintenance');

-- ==================== SEED USERS ====================
-- Password: password123 (BCrypt encoded)
INSERT IGNORE INTO users (id, username, password, full_name, email, phone, rank_title, unit, enabled) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Col. Rajesh Kumar', 'admin@army.mil', '+91-9876543210', 'Colonel', 'HQ Command', TRUE),
(2, 'officer1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maj. Vikram Singh', 'vikram@army.mil', '+91-9876543211', 'Major', '4th Infantry Division', TRUE),
(3, 'officer2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Capt. Priya Sharma', 'priya@army.mil', '+91-9876543212', 'Captain', '7th Armored Brigade', TRUE),
(4, 'soldier1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hav. Amit Yadav', 'amit@army.mil', '+91-9876543213', 'Havildar', '4th Infantry Division', TRUE),
(5, 'soldier2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sep. Ravi Patel', 'ravi@army.mil', '+91-9876543214', 'Sepoy', '7th Armored Brigade', TRUE);

-- ==================== SEED USER_ROLES ====================
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1, 1),  -- admin -> ROLE_ADMIN
(2, 2),  -- officer1 -> ROLE_OFFICER
(3, 2),  -- officer2 -> ROLE_OFFICER
(4, 3),  -- soldier1 -> ROLE_SOLDIER
(5, 3);  -- soldier2 -> ROLE_SOLDIER

-- ==================== SEED WEAPON CATEGORIES ====================
INSERT IGNORE INTO weapon_categories (id, name, description) VALUES
(1, 'Assault Rifle', 'Standard issue assault rifles for infantry'),
(2, 'Sniper Rifle', 'Long-range precision rifles'),
(3, 'Light Machine Gun', 'Squad automatic weapons'),
(4, 'Pistol', 'Sidearm handguns'),
(5, 'Rocket Launcher', 'Anti-tank and anti-aircraft launchers'),
(6, 'Shotgun', 'Close-quarter combat shotguns'),
(7, 'Submachine Gun', 'Compact automatic weapons');

-- ==================== SEED WEAPONS (10 items) ====================
INSERT IGNORE INTO weapons (id, name, serial_number, category_id, weapon_type, caliber, manufacturer, quantity, status, description) VALUES
(1,  'INSAS Rifle',        'WPN-2024-001', 1, 'Assault Rifle',     '5.56x45mm NATO', 'Indian Ordnance Factory', 150, 'ACTIVE',           'Standard issue Indian Small Arms System rifle'),
(2,  'AK-203',             'WPN-2024-002', 1, 'Assault Rifle',     '7.62x39mm',      'Indo-Russian Rifles Pvt Ltd', 200, 'ACTIVE',       'Modern assault rifle jointly manufactured'),
(3,  'Dragunov SVD',       'WPN-2024-003', 2, 'Sniper Rifle',      '7.62x54mm',      'Izhmash',                50,  'ACTIVE',           'Semi-automatic sniper rifle'),
(4,  'IWI Negev',          'WPN-2024-004', 3, 'Light Machine Gun',  '5.56x45mm NATO', 'Israel Weapon Industries', 75, 'ACTIVE',          'Belt-fed light machine gun'),
(5,  'Glock 17',           'WPN-2024-005', 4, 'Pistol',            '9x19mm',         'Glock Ges.m.b.H.',       300, 'ACTIVE',           'Standard sidearm pistol'),
(6,  'Carl Gustaf M4',     'WPN-2024-006', 5, 'Rocket Launcher',   '84mm',           'Saab Bofors Dynamics',    30,  'ACTIVE',           'Multi-role recoilless rifle'),
(7,  'Benelli M4',         'WPN-2024-007', 6, 'Shotgun',           '12 Gauge',       'Benelli Armi',            45,  'ACTIVE',           'Semi-automatic tactical shotgun'),
(8,  'MP5',                'WPN-2024-008', 7, 'Submachine Gun',    '9x19mm',         'Heckler & Koch',          100, 'ACTIVE',           'Compact submachine gun for special ops'),
(9,  'SIG 716 G2',         'WPN-2024-009', 1, 'Assault Rifle',     '7.62x51mm NATO', 'SIG Sauer',               80,  'ACTIVE',           'Battle rifle for designated marksman role'),
(10, 'Excalibur (Decom)',  'WPN-2024-010', 2, 'Sniper Rifle',      '8.6x70mm',       'Indian Ordnance Factory', 10,  'DECOMMISSIONED',  'Legacy sniper system, decommissioned');

-- ==================== SEED AMMUNITION ====================
INSERT IGNORE INTO ammunition_stock (id, name, ammo_type, caliber, quantity, reorder_threshold, location, status) VALUES
(1, '5.56mm NATO FMJ',   'Full Metal Jacket',  '5.56x45mm', 50000, 5000,  'Depot Alpha', 'IN_STOCK'),
(2, '7.62mm Soviet',     'Ball Ammunition',    '7.62x39mm', 30000, 3000,  'Depot Alpha', 'IN_STOCK'),
(3, '9mm Parabellum',    'FMJ',               '9x19mm',    40000, 4000,  'Depot Bravo', 'IN_STOCK'),
(4, '7.62mm NATO',       'Match Grade',        '7.62x51mm', 15000, 2000,  'Depot Alpha', 'IN_STOCK'),
(5, '12 Gauge Buckshot', 'Buckshot',           '12 Gauge',  5000,  500,   'Depot Charlie', 'IN_STOCK'),
(6, '84mm HEAT',         'High Explosive',     '84mm',      200,   50,    'Depot Delta', 'IN_STOCK');

-- ==================== SEED MISSIONS ====================
INSERT IGNORE INTO missions (id, mission_name, mission_code, description, location, start_date, end_date, status, commanding_officer_id) VALUES
(1, 'Operation Thunder Strike', 'OTS-2024-01', 'Border patrol and surveillance operation', 'Northern Sector, LOC', '2024-06-01', '2024-06-15', 'COMPLETED', 2),
(2, 'Operation Desert Shield',  'ODS-2024-02', 'Counter-insurgency operation in western sector', 'Rajasthan Border', '2024-07-10', NULL, 'ACTIVE', 3);
