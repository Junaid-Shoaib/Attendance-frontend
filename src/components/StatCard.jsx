import React from 'react';

export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const accents = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accents[accent]}`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-ink leading-tight">{value}</p>
        <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
      </div>
    </div>
  );
}
