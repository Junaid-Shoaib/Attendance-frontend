import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, CalendarOff, Clock, Percent, FileClock, Smartphone } from 'lucide-react';
import { getAdminDashboard } from '../../api/resources';
import StatCard from '../../components/StatCard';
import Spinner from '../../components/Spinner';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const stats = [
    { icon: Users, label: 'Total Employees', value: data.total_employees, accent: 'primary' },
    { icon: UserCheck, label: 'Present Today', value: data.present_today, accent: 'green' },
    { icon: UserX, label: 'Absent Today', value: data.absent_today, accent: 'red' },
    { icon: CalendarOff, label: 'On Leave Today', value: data.on_leave_today, accent: 'amber' },
    { icon: Clock, label: 'Late Arrivals', value: data.late_today, accent: 'amber' },
    { icon: Percent, label: 'Attendance Rate', value: `${data.attendance_percentage}%`, accent: 'primary' },
    { icon: FileClock, label: 'Pending Leave Requests', value: data.pending_leave_requests, accent: 'amber' },
    { icon: Smartphone, label: 'Pending Device Approvals', value: data.pending_device_approvals, accent: 'red' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Company Overview</h1>
        <p className="text-sm text-slate-500 mt-1">A snapshot of today's attendance across the organization.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {data.monthly_attendance_breakdown && (
        <div className="card">
          <h2 className="font-bold text-ink mb-4">This Month's Attendance Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(data.monthly_attendance_breakdown).map(([status, count]) => (
              <div key={status} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xl font-extrabold text-ink">{count}</p>
                <p className="text-xs text-slate-500 capitalize mt-1">{status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
