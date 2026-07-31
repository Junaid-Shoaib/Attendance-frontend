import React, { useEffect, useState } from 'react';
import { Users, UserCheck, FileClock, CalendarClock } from 'lucide-react';
import { getManagerDashboard } from '../../api/resources';
import StatCard from '../../components/StatCard';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getManagerDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const stats = [
    { icon: Users, label: 'Team Size', value: data.team_size, accent: 'primary' },
    { icon: UserCheck, label: 'Present Today', value: data.present_today, accent: 'green' },
    { icon: FileClock, label: 'Pending Leave Approvals', value: data.pending_leave_approvals, accent: 'amber' },
    { icon: CalendarClock, label: 'Pending Corrections', value: data.pending_regularizations, accent: 'amber' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500 mt-1">Here's how your team is doing today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
    </div>
  );
}
