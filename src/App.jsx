import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import Devices from './pages/admin/Devices';
import AdminLeaves from './pages/admin/Leaves';
import AdminAttendance from './pages/admin/Attendance';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamAttendance from './pages/manager/TeamAttendance';
import ManagerLeaves from './pages/manager/Leaves';
import Regularizations from './pages/manager/Regularizations';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin portal */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/devices" element={<Devices />} />
          <Route path="/admin/leaves" element={<AdminLeaves />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Manager portal */}
      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/team" element={<TeamAttendance />} />
          <Route path="/manager/leaves" element={<ManagerLeaves />} />
          <Route path="/manager/regularizations" element={<Regularizations />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
