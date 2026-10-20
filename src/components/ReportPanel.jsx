import React, { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { Download } from 'lucide-react';
import Table from './Table';
import Badge from './Badge';
import Spinner from './Spinner';
import {
  attendanceReport, leaveReport, managerAttendanceReport, managerLeaveReport,
  downloadAttendanceReport, downloadLeaveReport,
  listUsers, managerEmployeeDirectory,
} from '../api/resources';

// Used by both Admin Reports and Manager Reports (Section 3 & 6). The
// employee-selection UI (Individual / Multiple / All) is identical for
// both; what differs is which endpoints are called - Manager's calls are
// scoped to Employee-role users on the backend, not just hidden here.
export default function ReportPanel({ scope }) {
  const isManager = scope === 'manager';
  const [type, setType] = useState('attendance');
  const [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mode, setMode] = useState('all'); // all | individual | multiple
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIds, setEmployeeIds] = useState([]);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loader = isManager
      ? managerEmployeeDirectory({ per_page: 200 })
      : listUsers({ per_page: 200 });
    loader.then((result) => setEmployees(result.data || []));
  }, [isManager]);

  const buildParams = () => {
    const params = { from, to };
    if (mode === 'individual' && employeeId) params.employee_id = employeeId;
    if (mode === 'multiple' && employeeIds.length) params.employee_ids = employeeIds;
    return params;
  };

  const run = async () => {
    setLoading(true);
    setRows(null);
    try {
      const params = buildParams();
      const fetcher = type === 'attendance'
        ? (isManager ? managerAttendanceReport : attendanceReport)
        : (isManager ? managerLeaveReport : leaveReport);
      const result = await fetcher(params);
      setRows(result.data);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (fmt) => {
    setExporting(true);
    try {
      const params = { ...buildParams(), export: fmt };
      if (type === 'attendance') await downloadAttendanceReport(params, scope);
      else await downloadLeaveReport(params, scope);
    } finally {
      setExporting(false);
    }
  };

  const toggleEmployeeId = (id) => {
    setEmployeeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div>
      <div className="card mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Report Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="attendance">Attendance</option>
              <option value="leaves">Leave</option>
            </select>
          </div>
          <div>
            <label className="label">From</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Employees</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {['all', 'individual', 'multiple'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  mode === m ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}>
                {m === 'all' ? 'All Employees' : m === 'individual' ? 'Individual Employee' : 'Multiple Employees'}
              </button>
            ))}
          </div>

          {mode === 'individual' && (
            <select className="input max-w-sm" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Select an employee…</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>
              ))}
            </select>
          )}

          {mode === 'multiple' && (
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 max-w-sm space-y-1">
              {employees.map((e) => (
                <label key={e.id} className="flex items-center gap-2 text-sm px-1 py-0.5">
                  <input
                    type="checkbox"
                    checked={employeeIds.includes(e.id)}
                    onChange={() => toggleEmployeeId(e.id)}
                  />
                  {e.name} <span className="text-xs text-slate-400">({e.employee_id})</span>
                </label>
              ))}
              {employees.length === 0 && <p className="text-xs text-slate-400 px-1">No employees found.</p>}
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={run} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Report'}
        </button>
      </div>

      {rows !== null && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-wrap gap-2">
            <p className="text-sm font-semibold text-ink">{rows.length} result{rows.length === 1 ? '' : 's'} (this page)</p>
            <div className="flex gap-2">
              <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={() => handleExport('csv')} disabled={exporting}>
                <Download size={14} /> Export CSV
              </button>
              <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={() => handleExport('xlsx')} disabled={exporting}>
                <Download size={14} /> Export Excel
              </button>
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : type === 'attendance' ? (
            <Table
              columns={['Employee', 'Date', 'Time In', 'Time Out', 'Hours', 'Status']}
              data={rows}
              renderRow={(r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="td">{r.user?.name} <span className="text-xs text-slate-400">({r.user?.employee_id})</span></td>
                  <td className="td">{r.date}</td>
                  <td className="td">{r.time_in ? new Date(r.time_in).toLocaleTimeString() : '—'}</td>
                  <td className="td">{r.time_out ? new Date(r.time_out).toLocaleTimeString() : '—'}</td>
                  <td className="td">{r.working_hours ?? '—'}</td>
                  <td className="td"><Badge status={r.status} /></td>
                </tr>
              )}
            />
          ) : (
            <Table
              columns={['Employee', 'Leave Type', 'From', 'To', 'Days', 'Status']}
              data={rows}
              renderRow={(r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="td">{r.user?.name} <span className="text-xs text-slate-400">({r.user?.employee_id})</span></td>
                  <td className="td">{r.leave_type?.name}</td>
                  <td className="td">{r.start_date}</td>
                  <td className="td">{r.end_date}</td>
                  <td className="td">{r.total_days}</td>
                  <td className="td"><Badge status={r.status} /></td>
                </tr>
              )}
            />
          )}

          <p className="text-xs text-slate-400 px-4 py-3 border-t border-slate-100">
            The table shows one page of results. Export CSV/Excel to get the complete filtered report.
          </p>
        </div>
      )}
    </div>
  );
}
