import axios from 'axios';

// Detect if we should run in MOCK mode (only when NOT on localhost)
const MOCK_MODE = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Create axios instance with base URL pointing to Spring Boot backend
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor - handle 401 errors (expired/invalid token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ======================== MOCK DATABASE SEEDING ========================
const getMockData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Seed Data
const DEFAULT_WEAPONS = [
  { id: 1, name: "INSAS Rifle", serialNumber: "INSAS-556-9821", weaponType: "Assault Rifle", caliber: "5.56x45mm NATO", manufacturer: "Ordnance Factory Board", quantity: 120, status: "ACTIVE", description: "Standard Indian infantry rifle" },
  { id: 2, name: "SIG Sauer 716", serialNumber: "SIG-716-1192", weaponType: "Battle Rifle", caliber: "7.62x51mm NATO", manufacturer: "SIG Sauer", quantity: 45, status: "ACTIVE", description: "Frontline battle rifle" },
  { id: 3, name: "Glock 17 Gen 5", serialNumber: "GLK-919-4820", weaponType: "Pistol", caliber: "9x19mm Parabellum", manufacturer: "Glock Ges.m.b.H.", quantity: 80, status: "ACTIVE", description: "Polymer service sidearm" },
  { id: 4, name: "Dragunov SVD", serialNumber: "SVD-762-0941", weaponType: "Sniper Rifle", caliber: "7.62x54mmR", manufacturer: "Kalashnikov Concern", quantity: 15, status: "ACTIVE", description: "Designated marksman sniper rifle" },
  { id: 5, name: "FN Minimi", serialNumber: "M249-556-3849", weaponType: "Light Machine Gun", caliber: "5.56x45mm NATO", manufacturer: "FN Herstal", quantity: 8, status: "ACTIVE", description: "Squad automatic support weapon" }
];

const DEFAULT_AMMO = [
  { id: 1, name: "5.56mm NATO FMJ", caliber: "5.56x45mm NATO", ammoType: "Ball / FMJ", quantity: 25000, reorderThreshold: 5000, status: "IN_STOCK", location: "Storage Locker A1" },
  { id: 2, name: "7.62mm AP Cartridges", caliber: "7.62x51mm NATO", ammoType: "AP (Armor Piercing)", quantity: 1200, reorderThreshold: 3000, status: "LOW_STOCK", location: "Storage Locker B3" },
  { id: 3, name: "9mm Parabellum FMJ", caliber: "9x19mm Parabellum", ammoType: "FMJ Sidearm Ammo", quantity: 8500, reorderThreshold: 2000, status: "IN_STOCK", location: "Storage Locker A3" },
  { id: 4, name: "7.62mm Sniper Precision", caliber: "7.62x54mmR", ammoType: "Sniper Precision Match", quantity: 350, reorderThreshold: 500, status: "LOW_STOCK", location: "Sniper Base Depot" }
];

const DEFAULT_ASSIGNMENTS = [
  { id: 1, weapon: DEFAULT_WEAPONS[0], assignedTo: { fullName: "Cpl. Rohan Sharma", rankTitle: "Corporal" }, assignedBy: { fullName: "Maj. Vikram Singh" }, assignmentDate: "2026-05-12", expectedReturnDate: "2026-06-12", conditionOnIssue: "EXCELLENT", status: "ACTIVE" },
  { id: 2, weapon: DEFAULT_WEAPONS[1], assignedTo: { fullName: "Sgt. Arjun Naik", rankTitle: "Sergeant" }, assignedBy: { fullName: "Maj. Vikram Singh" }, assignmentDate: "2026-04-10", expectedReturnDate: "2026-05-10", conditionOnIssue: "GOOD", status: "OVERDUE" }
];

const DEFAULT_MAINTENANCE = [
  { id: 1, weapon: DEFAULT_WEAPONS[0], requestedBy: { fullName: "Cpl. Rohan Sharma" }, assignedTo: { fullName: "L/Nk. Amit Kumar" }, requestedDate: "2026-05-15", issueDescription: "Trigger group assembly stiff, requires lubricating", priority: "MEDIUM", status: "IN_PROGRESS" },
  { id: 2, weapon: DEFAULT_WEAPONS[3], requestedBy: { fullName: "Sgt. Arjun Naik" }, assignedTo: null, requestedDate: "2026-05-16", issueDescription: "High magnification optic reticle misalignment", priority: "HIGH", status: "PENDING" }
];

const DEFAULT_MISSIONS = [
  { id: 1, missionCode: "OP-DESERT", missionName: "Operation Desert Shield", status: "ACTIVE", location: "Rajasthan Border Sector", description: "Frontline patrol deployment", commandingOfficer: { fullName: "Maj. Vikram Singh" }, startDate: "2026-05-01", endDate: "2026-05-30" },
  { id: 2, missionCode: "OP-SNOW", missionName: "Operation Snow Falcon", status: "PLANNED", location: "Leh-Ladakh Sector", description: "Winter high-altitude survival training", commandingOfficer: { fullName: "Maj. Vikram Singh" }, startDate: "2026-06-15", endDate: "2026-07-15" }
];

const DEFAULT_AUDITS = [
  { id: 1, performedBy: "admin", action: "CREATE", entityType: "WEAPON", entityId: 1, timestamp: "2026-05-17 14:00:00" },
  { id: 2, performedBy: "officer1", action: "CREATE", entityType: "ASSIGNMENT", entityId: 1, timestamp: "2026-05-17 14:15:00" }
];

const mockPromise = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), 150);
  });
};

// ======================== AUTH API ========================
export const authAPI = {
  login: (data) => {
    if (MOCK_MODE) {
      const user = {
        accessToken: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        username: data.username,
        email: data.username + "@army.mil",
        roles: [data.username === 'admin' ? 'ROLE_ADMIN' : data.username === 'officer1' ? 'ROLE_OFFICER' : 'ROLE_SOLDIER'],
        fullName: data.username === 'admin' ? 'Col. Rajesh Kumar' : data.username === 'officer1' ? 'Maj. Vikram Singh' : 'Cpl. Rohan Sharma'
      };
      localStorage.setItem('user', JSON.stringify(user));
      return mockPromise(user);
    }
    return API.post('/auth/login', data);
  },
  register: (data) => {
    if (MOCK_MODE) return mockPromise(data);
    return API.post('/auth/register', data);
  },
  refresh: (refreshToken) => {
    if (MOCK_MODE) return mockPromise({ accessToken: "mock-new-jwt" });
    return API.post('/auth/refresh', { refreshToken });
  },
  getUsers: () => {
    if (MOCK_MODE) return mockPromise([{ id: 1, username: "admin", fullName: "Col. Rajesh Kumar" }]);
    return API.get('/auth/users');
  }
};

// ======================== WEAPONS API ========================
export const weaponAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_weapons', DEFAULT_WEAPONS));
    return API.get('/weapons');
  },
  getById: (id) => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      return mockPromise(weapons.find(w => w.id === Number(id)));
    }
    return API.get(`/weapons/${id}`);
  },
  search: (query) => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      return mockPromise(weapons.filter(w => w.name.toLowerCase().includes(query.toLowerCase())));
    }
    return API.get(`/weapons/search?query=${query}`);
  },
  getByStatus: (status) => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      return mockPromise(weapons.filter(w => w.status === status));
    }
    return API.get(`/weapons/status/${status}`);
  },
  getCategories: () => {
    if (MOCK_MODE) return mockPromise([{ id: 1, name: "Assault Rifles" }, { id: 2, name: "Sniper Rifles" }, { id: 3, name: "Pistols" }, { id: 4, name: "Machine Guns" }]);
    return API.get('/weapons/categories');
  },
  create: (data) => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      const newW = { ...data, id: weapons.length + 1 };
      weapons.push(newW);
      saveMockData('mock_weapons', weapons);
      // Log Action
      const audits = getMockData('mock_audits', DEFAULT_AUDITS);
      audits.unshift({ id: audits.length + 1, performedBy: "admin", action: "CREATE", entityType: "WEAPON", entityId: newW.id, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) });
      saveMockData('mock_audits', audits);
      return mockPromise(newW);
    }
    return API.post('/weapons', data);
  },
  update: (id, data) => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      const idx = weapons.findIndex(w => w.id === Number(id));
      if (idx !== -1) {
        weapons[idx] = { ...weapons[idx], ...data };
        saveMockData('mock_weapons', weapons);
        return mockPromise(weapons[idx]);
      }
    }
    return API.put(`/weapons/${id}`, data);
  },
  delete: (id) => {
    if (MOCK_MODE) {
      let weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      weapons = weapons.filter(w => w.id !== Number(id));
      saveMockData('mock_weapons', weapons);
      return mockPromise({ success: true });
    }
    return API.delete(`/weapons/${id}`);
  }
};

// ======================== ASSIGNMENTS API ========================
export const assignmentAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_assignments', DEFAULT_ASSIGNMENTS));
    return API.get('/assignments');
  },
  getById: (id) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_assignments', DEFAULT_ASSIGNMENTS);
      return mockPromise(list.find(a => a.id === Number(id)));
    }
    return API.get(`/assignments/${id}`);
  },
  getByUser: (userId) => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_assignments', DEFAULT_ASSIGNMENTS));
    return API.get(`/assignments/user/${userId}`);
  },
  create: (data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_assignments', DEFAULT_ASSIGNMENTS);
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      const targetW = weapons.find(w => w.id === Number(data.weaponId)) || DEFAULT_WEAPONS[0];
      const newA = {
        id: list.length + 1,
        weapon: targetW,
        assignedTo: { fullName: "Cpl. Rohan Sharma", rankTitle: "Corporal" },
        assignedBy: { fullName: "Col. Rajesh Kumar" },
        assignmentDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: data.expectedReturnDate || new Date().toISOString().split('T')[0],
        conditionOnIssue: data.conditionOnIssue || "GOOD",
        status: "ACTIVE"
      };
      list.unshift(newA);
      saveMockData('mock_assignments', list);
      return mockPromise(newA);
    }
    return API.post('/assignments', data);
  },
  update: (id, data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_assignments', DEFAULT_ASSIGNMENTS);
      const idx = list.findIndex(a => a.id === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        saveMockData('mock_assignments', list);
        return mockPromise(list[idx]);
      }
    }
    return API.put(`/assignments/${id}`, data);
  },
  delete: (id) => {
    if (MOCK_MODE) {
      let list = getMockData('mock_assignments', DEFAULT_ASSIGNMENTS);
      list = list.filter(a => a.id !== Number(id));
      saveMockData('mock_assignments', list);
      return mockPromise({ success: true });
    }
    return API.delete(`/assignments/${id}`);
  }
};

// ======================== MAINTENANCE API ========================
export const maintenanceAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_maintenance', DEFAULT_MAINTENANCE));
    return API.get('/maintenance');
  },
  getById: (id) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      return mockPromise(list.find(m => m.id === Number(id)));
    }
    return API.get(`/maintenance/${id}`);
  },
  getByStatus: (status) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      return mockPromise(list.filter(m => m.status === status));
    }
    return API.get(`/maintenance/status/${status}`);
  },
  create: (data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      const targetW = weapons.find(w => w.id === Number(data.weaponId)) || DEFAULT_WEAPONS[0];
      const newM = {
        id: list.length + 1,
        weapon: targetW,
        requestedBy: { fullName: "Col. Rajesh Kumar" },
        assignedTo: null,
        requestedDate: new Date().toISOString().split('T')[0],
        issueDescription: data.issueDescription || "General inspection",
        priority: data.priority || "MEDIUM",
        status: "PENDING"
      };
      list.unshift(newM);
      saveMockData('mock_maintenance', list);
      return mockPromise(newM);
    }
    return API.post('/maintenance', data);
  },
  update: (id, data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      const idx = list.findIndex(m => m.id === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        saveMockData('mock_maintenance', list);
        return mockPromise(list[idx]);
      }
    }
    return API.put(`/maintenance/${id}`, data);
  },
  delete: (id) => {
    if (MOCK_MODE) {
      let list = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      list = list.filter(m => m.id !== Number(id));
      saveMockData('mock_maintenance', list);
      return mockPromise({ success: true });
    }
    return API.delete(`/maintenance/${id}`);
  }
};

// ======================== AMMUNITION API ========================
export const ammoAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_ammo', DEFAULT_AMMO));
    return API.get('/ammunition');
  },
  getById: (id) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_ammo', DEFAULT_AMMO);
      return mockPromise(list.find(a => a.id === Number(id)));
    }
    return API.get(`/ammunition/${id}`);
  },
  getLowStock: () => {
    if (MOCK_MODE) {
      const list = getMockData('mock_ammo', DEFAULT_AMMO);
      return mockPromise(list.filter(a => a.quantity <= a.reorderThreshold));
    }
    return API.get('/ammunition/low-stock');
  },
  create: (data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_ammo', DEFAULT_AMMO);
      const newA = { ...data, id: list.length + 1, status: data.quantity <= data.reorderThreshold ? "LOW_STOCK" : "IN_STOCK" };
      list.push(newA);
      saveMockData('mock_ammo', list);
      return mockPromise(newA);
    }
    return API.post('/ammunition', data);
  },
  update: (id, data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_ammo', DEFAULT_AMMO);
      const idx = list.findIndex(a => a.id === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, status: (data.quantity || list[idx].quantity) <= (data.reorderThreshold || list[idx].reorderThreshold) ? "LOW_STOCK" : "IN_STOCK" };
        saveMockData('mock_ammo', list);
        return mockPromise(list[idx]);
      }
    }
    return API.put(`/ammunition/${id}`, data);
  },
  delete: (id) => {
    if (MOCK_MODE) {
      let list = getMockData('mock_ammo', DEFAULT_AMMO);
      list = list.filter(a => a.id !== Number(id));
      saveMockData('mock_ammo', list);
      return mockPromise({ success: true });
    }
    return API.delete(`/ammunition/${id}`);
  }
};

// ======================== MISSIONS API ========================
export const missionAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_missions', DEFAULT_MISSIONS));
    return API.get('/missions');
  },
  getById: (id) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_missions', DEFAULT_MISSIONS);
      return mockPromise(list.find(m => m.id === Number(id)));
    }
    return API.get(`/missions/${id}`);
  },
  create: (data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_missions', DEFAULT_MISSIONS);
      const newM = {
        ...data,
        id: list.length + 1,
        commandingOfficer: { fullName: "Col. Rajesh Kumar" }
      };
      list.push(newM);
      saveMockData('mock_missions', list);
      return mockPromise(newM);
    }
    return API.post('/missions', data);
  },
  update: (id, data) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_missions', DEFAULT_MISSIONS);
      const idx = list.findIndex(m => m.id === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        saveMockData('mock_missions', list);
        return mockPromise(list[idx]);
      }
    }
    return API.put(`/missions/${id}`, data);
  }
};

// ======================== DASHBOARD API ========================
export const dashboardAPI = {
  getStats: () => {
    if (MOCK_MODE) {
      const weapons = getMockData('mock_weapons', DEFAULT_WEAPONS);
      const assignments = getMockData('mock_assignments', DEFAULT_ASSIGNMENTS);
      const maintenance = getMockData('mock_maintenance', DEFAULT_MAINTENANCE);
      const ammo = getMockData('mock_ammo', DEFAULT_AMMO);
      const missions = getMockData('mock_missions', DEFAULT_MISSIONS);
      const audits = getMockData('mock_audits', DEFAULT_AUDITS);

      // Weapon types and counts mapping
      const weaponsByType = {};
      const weaponsByStatus = {};
      weapons.forEach(w => {
        weaponsByType[w.weaponType] = (weaponsByType[w.weaponType] || 0) + w.quantity;
        weaponsByStatus[w.status] = (weaponsByStatus[w.status] || 0) + 1;
      });

      const stats = {
        totalWeapons: weapons.reduce((acc, w) => acc + w.quantity, 0),
        activeAssignments: assignments.filter(a => a.status === 'ACTIVE' || a.status === 'OVERDUE').length,
        pendingMaintenance: maintenance.filter(m => m.status === 'PENDING' || m.status === 'IN_PROGRESS').length,
        lowStockAmmo: ammo.filter(a => a.quantity <= a.reorderThreshold).length,
        activeMissions: missions.filter(m => m.status === 'ACTIVE').length,
        totalUsers: 3,
        weaponsByType,
        weaponsByStatus,
        ammoAlerts: ammo.filter(a => a.quantity <= a.reorderThreshold),
        recentActivity: audits.slice(0, 5)
      };
      return mockPromise(stats);
    }
    return API.get('/dashboard/stats');
  }
};

// ======================== AUDIT API ========================
export const auditAPI = {
  getAll: () => {
    if (MOCK_MODE) return mockPromise(getMockData('mock_audits', DEFAULT_AUDITS));
    return API.get('/audit');
  },
  getRecent: (count = 20) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_audits', DEFAULT_AUDITS);
      return mockPromise(list.slice(0, count));
    }
    return API.get(`/audit/recent?count=${count}`);
  },
  getByEntity: (type) => {
    if (MOCK_MODE) {
      const list = getMockData('mock_audits', DEFAULT_AUDITS);
      return mockPromise(list.filter(l => l.entityType === type));
    }
    return API.get(`/audit/entity/${type}`);
  }
};

// ======================== REPORTS API ========================
export const reportAPI = {
  generatePDF: () => {
    if (MOCK_MODE) {
      // Return a blank blob for pdf generation simulation
      const blob = new Blob(["Mock PDF Content"], { type: "application/pdf" });
      return mockPromise(blob);
    }
    return API.get('/reports/generate', { responseType: 'blob' });
  }
};

export default API;
