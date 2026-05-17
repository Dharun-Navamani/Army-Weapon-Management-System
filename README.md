# 🛡️ Army Weapon Management System (AWMS)

A comprehensive **full-stack military weapon lifecycle management platform** built with **Java Spring Boot 3** and **React 18**. This system provides real-time weapon inventory tracking, soldier assignments, maintenance scheduling, ammunition monitoring, mission logging, audit trails, and executive dashboards with PDF report generation.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [Default Credentials](#-default-credentials)
- [API Documentation](#-api-documentation)
- [Modules Overview](#-modules-overview)

---

## 🚀 Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| **Backend**    | Java 17, Spring Boot 3.2.5, Spring Security    |
| **ORM**        | Spring Data JPA, Hibernate                      |
| **Database**   | MySQL 8.0                                       |
| **Auth**       | JWT (JSON Web Tokens) with RBAC                 |
| **Frontend**   | React 18, Vite, Tailwind CSS 3.4               |
| **Charts**     | Recharts (Bar, Pie charts)                      |
| **PDF Export**  | iText 7                                        |
| **API Docs**   | Swagger/OpenAPI 3 (SpringDoc)                   |
| **Build**      | Maven (backend), npm (frontend)                 |
| **IDE**        | IntelliJ IDEA / Eclipse compatible              |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based login/logout with refresh tokens
- Role-Based Access Control (RBAC): **Admin**, **Officer**, **Soldier**
- BCrypt password hashing
- Stateless session management

### 🔫 Weapon Inventory Management
- Full CRUD operations on weapons
- Search by name or serial number
- Filter by status (Active/Inactive/Decommissioned)
- Category classification

### 📋 Weapon Assignment Tracking
- Assign weapons to soldiers with date tracking
- Track issue/return conditions
- Status management (Active/Returned/Overdue/Lost)

### 🔧 Maintenance & Repair Module
- Submit maintenance requests with priority levels
- Assign armourers for repairs
- Track status from PENDING → IN_PROGRESS → COMPLETED
- Resolution notes and completion timestamps

### 🎯 Ammunition Stock Management
- Track ammunition by type and caliber
- Auto-detect low stock (quantity ≤ reorder threshold)
- Dashboard alerts for critical stock levels

### 🗺️ Mission Log Module
- Log missions with weapons and soldiers involved
- Track mission status (Planned/Active/Completed/Aborted)
- Associate weapons and soldiers per mission

### 📝 Audit Trail
- Automatic logging of all Create/Update/Delete operations
- Track who did what, when
- Filter by entity type or username

### 📊 Dashboard & Reports
- Summary cards with live statistics
- Bar chart: weapons by type
- Pie chart: weapons by status
- Low stock ammo alerts
- Recent activity feed
- **PDF export** for weapon inventory reports

---

## 📁 Project Structure

```
Army Weapon Management System/
├── pom.xml                          # Maven build config
├── src/main/java/com/military/awms/
│   ├── AwmsApplication.java         # Spring Boot entry point
│   ├── config/
│   │   ├── SecurityConfig.java      # Spring Security + JWT config
│   │   ├── SwaggerConfig.java       # OpenAPI documentation
│   │   └── DataInitializer.java     # Seed data on startup
│   ├── security/
│   │   ├── JwtTokenProvider.java    # JWT token generation/validation
│   │   ├── JwtAuthenticationFilter.java  # Request filter
│   │   ├── CustomUserDetailsService.java # User loading
│   │   └── JwtAuthEntryPoint.java   # 401 handler
│   ├── model/                       # JPA Entities
│   │   ├── User.java, Role.java, Weapon.java
│   │   ├── Assignment.java, MaintenanceRequest.java
│   │   ├── AmmunitionStock.java, Mission.java
│   │   ├── MissionWeapon.java, AuditLog.java
│   │   └── enums/                   # Status enums
│   ├── dto/
│   │   ├── request/                 # Input DTOs with validation
│   │   └── response/                # Output DTOs
│   ├── repository/                  # Spring Data JPA repositories
│   ├── service/                     # Business logic layer
│   ├── controller/                  # REST API controllers
│   └── exception/                   # Global exception handling
├── src/main/resources/
│   ├── application.yml              # App configuration
│   ├── schema.sql                   # DDL reference
│   └── data.sql                     # Seed data reference
└── frontend/                        # React application
    ├── src/
    │   ├── pages/                   # All 8 module pages
    │   ├── components/Layout.jsx    # Sidebar + layout
    │   ├── context/AuthContext.jsx  # Auth state management
    │   ├── services/api.js          # Axios API layer
    │   └── App.jsx                  # Routing
    └── package.json
```

---

## 📌 Prerequisites

1. **Java 17+** (JDK) — [Download](https://adoptium.net/)
2. **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)
3. **Node.js 18+** with npm — [Download](https://nodejs.org/)
4. **Maven 3.8+** (or use the Maven wrapper)
5. **Git** (optional)

---

## ⚡ Setup Instructions

### 1️⃣ Database Setup

```sql
-- Open MySQL and create the database:
CREATE DATABASE army_weapon_db;
```

> The tables will be auto-created by Hibernate on first run (`ddl-auto: update`).

### 2️⃣ Configure Database Credentials

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/army_weapon_db
    username: root        # ← Change to your MySQL username
    password: root        # ← Change to your MySQL password
```

### 3️⃣ Run the Spring Boot Backend

```bash
# From the project root directory:
mvn spring-boot:run

# Or if Maven is not installed globally:
./mvnw spring-boot:run
```

The backend will start at: **http://localhost:8080**

> On first run, it automatically seeds 3 roles, 5 users, and sample data.

### 4️⃣ Run the React Frontend

```bash
# Navigate to frontend directory:
cd frontend

# Install dependencies:
npm install

# Start development server:
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## 🔑 Default Credentials

| Username   | Password      | Role     | Access Level                     |
|-----------|---------------|----------|----------------------------------|
| `admin`    | `password123` | ADMIN    | Full CRUD access to all modules  |
| `officer1` | `password123` | OFFICER  | View + manage assignments/missions |
| `officer2` | `password123` | OFFICER  | View + manage assignments/missions |
| `soldier1` | `password123` | SOLDIER  | View assigned weapons            |
| `soldier2` | `password123` | SOLDIER  | View assigned weapons            |

---

## 📖 API Documentation

Once the backend is running, access Swagger UI at:

🔗 **http://localhost:8080/swagger-ui.html**

### Key API Endpoints

| Method | Endpoint                  | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/api/auth/login`        | JWT Login                  |
| POST   | `/api/auth/register`     | Register user (Admin)      |
| POST   | `/api/auth/refresh`      | Refresh JWT token          |
| GET    | `/api/weapons`           | List all weapons           |
| POST   | `/api/weapons`           | Add weapon (Admin)         |
| GET    | `/api/assignments`       | List assignments           |
| POST   | `/api/assignments`       | Create assignment          |
| GET    | `/api/maintenance`       | List maintenance requests  |
| POST   | `/api/maintenance`       | Submit maintenance request |
| GET    | `/api/ammunition`        | List ammunition stock      |
| GET    | `/api/ammunition/low-stock` | Get low stock alerts    |
| GET    | `/api/missions`          | List missions              |
| GET    | `/api/dashboard/stats`   | Dashboard analytics        |
| GET    | `/api/reports/generate`  | Download PDF report        |
| GET    | `/api/audit`             | View audit trail           |

---

## 📦 Modules Overview

| # | Module                    | Description                                    |
|---|--------------------------|------------------------------------------------|
| 1 | Authentication & Auth     | JWT login, RBAC, token refresh                |
| 2 | Weapon Inventory          | CRUD with search, categories, status tracking |
| 3 | Weapon Assignment         | Assign/return weapons with condition tracking |
| 4 | Maintenance & Repair      | Request → Assign → Complete workflow          |
| 5 | Ammunition Stock          | Inventory with low-stock auto-alerts          |
| 6 | Mission Logs              | Mission tracking with weapon/soldier mapping  |
| 7 | Audit Trail               | Full compliance logging of all operations     |
| 8 | Dashboard & Reports       | Charts, stats, PDF export                     |

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| MySQL connection refused | Ensure MySQL is running on port 3306 |
| Access denied for user | Update credentials in `application.yml` |
| Port 8080 in use | Change `server.port` in `application.yml` |
| CORS errors | Frontend must run on port 5173 (configured) |
| `lombok` errors in IDE | Install Lombok plugin and enable annotation processing |

---

## 📄 License

This project is developed for educational/placement purposes.

---

**Built with ❤️ using Spring Boot 3 + React 18**
