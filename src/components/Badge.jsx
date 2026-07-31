import React from 'react';

const PALETTES = {
  present: 'bg-emerald-50 text-emerald-700',
  late: 'bg-orange-50 text-orange-700',
  absent: 'bg-red-50 text-red-700',
  on_leave: 'bg-amber-50 text-amber-700',
  holiday: 'bg-blue-50 text-blue-700',
  half_day: 'bg-purple-50 text-purple-700',
  weekend: 'bg-slate-100 text-slate-600',
  active: 'bg-emerald-50 text-emerald-700',
  disabled: 'bg-red-50 text-red-700',
  pending: 'bg-amber-50 text-amber-700',
  manager_approved: 'bg-blue-50 text-blue-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

export default function Badge({ status, label }) {
  const cls = PALETTES[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`badge ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {(label || status || '').replace(/_/g, ' ')}
    </span>
  );
}
