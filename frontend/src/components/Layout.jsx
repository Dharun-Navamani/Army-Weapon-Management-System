import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid, HiOutlineShieldCheck, HiOutlineSwitchHorizontal,
  HiOutlineCog, HiOutlineClipboardList, HiOutlineDocumentReport,
  HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineChevronLeft
} from 'react-icons/hi';
import { GiAk47, GiBullets, GiMilitaryFort } from 'react-icons/gi';

const navItems = [
  { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { to: '/weapons', icon: GiAk47, label: 'Weapons' },
  { to: '/assignments', icon: HiOutlineSwitchHorizontal, label: 'Assignments' },
  { to: '/maintenance', icon: HiOutlineCog, label: 'Maintenance' },
  { to: '/ammunition', icon: GiBullets, label: 'Ammunition' },
  { to: '/missions', icon: GiMilitaryFort, label: 'Missions' },
  { to: '/audit', icon: HiOutlineClipboardList, label: 'Audit Trail', roles: ['ROLE_ADMIN', 'ROLE_OFFICER'] },
  { to: '/reports', icon: HiOutlineDocumentReport, label: 'Reports' },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item =>
    !item.roles || item.roles.some(r => hasRole(r))
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${collapsed ? 'w-20' : 'w-64'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-military-900 via-military-900 to-black
        border-r border-military-700/30 flex flex-col
        transition-all duration-300 ease-in-out
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-military-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <HiOutlineShieldCheck className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white tracking-wide">AWMS</h1>
              <p className="text-[10px] text-military-400 tracking-widest uppercase">Weapon Mgmt</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-military-700/60 text-green-400 shadow-lg shadow-green-900/20'
                  : 'text-military-300 hover:bg-military-800/60 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-military-700/30">
          {!collapsed && (
            <div className="mb-3 px-1">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-military-400 truncate">{user?.rankTitle} • {user?.unit}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                {user?.roles?.[0]?.replace('ROLE_', '')}
              </span>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <HiOutlineLogout className="w-5 h-5" />
            {!collapsed && 'Logout'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-2 border-t border-military-700/30 text-military-400 hover:text-white transition-colors">
          <HiOutlineChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-military-900/80 backdrop-blur-lg border-b border-military-700/30 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-military-300 hover:text-white">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0)}
            </div>
            <span className="text-sm text-military-200 hidden sm:block">{user?.username}</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
