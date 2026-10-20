import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Users, Smartphone, FileText, BarChart3, Settings, LogOut,
  Menu, X, ClipboardCheck, CalendarClock, UserCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/devices', label: 'Device Approvals', icon: Smartphone },
  { to: '/admin/leaves', label: 'Leave Requests', icon: FileText },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const MANAGER_LINKS = [
  { to: '/manager', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/manager/team', label: 'Team Attendance', icon: Users },
  { to: '/manager/employees', label: 'Employees', icon: UserCircle },
  { to: '/manager/leaves', label: 'Leave Approvals', icon: FileText },
  { to: '/manager/regularizations', label: 'Corrections', icon: CalendarClock },
  { to: '/manager/reports', label: 'Reports', icon: BarChart3 },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user?.role === 'super_admin' ? ADMIN_LINKS : MANAGER_LINKS;
  const portalLabel = user?.role === 'super_admin' ? 'Admin Portal' : 'Manager Portal';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
    } catch {
      // Token likely already invalid server-side; clear locally regardless.
    } finally {
      navigate('/login');
    }
  };

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-extrabold text-sm">
          AMS
        </div>
        <div>
          <p className="font-bold text-sm text-ink leading-tight">Attendance</p>
          <p className="text-xs text-slate-400 leading-tight">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
              }`
            }>
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
            {user?.name?.[0] || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full justify-start">
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-100 bg-white">{Sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">{Sidebar}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button className="lg:hidden text-slate-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <UserCircle size={18} />
            <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
