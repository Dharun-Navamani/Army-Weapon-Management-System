import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WeaponsPage from './pages/WeaponsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import MaintenancePage from './pages/MaintenancePage';
import AmmunitionPage from './pages/AmmunitionPage';
import MissionsPage from './pages/MissionsPage';
import AuditPage from './pages/AuditPage';
import ReportsPage from './pages/ReportsPage';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-military-900">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#162016', color: '#e8f5e8', border: '1px solid #1e3a1e' },
          success: { iconTheme: { primary: '#4ade80', secondary: '#0a0f0a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0a0f0a' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/weapons" element={<WeaponsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/ammunition" element={<AmmunitionPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
