import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Download } from 'lucide-react';
import { attendanceReport, leaveReport } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';

function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((r) => columns.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','));
  return [header, ...lines].join('\n');
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [type, setType] = useState('attendance');
  const [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rows, setRows] = useState(null);

  const run = async () => {
    setRows(null);
    if (type === 'attendance') {
      const result = await attendanceReport({ from, to });
      setRows(result.data.map((r) => ({
        employee: r.user?.name, employee_id: r.user?.employee_id, date: r.date,
        time_in: r.time_in, time_out: r.time_out, working_hours: r.working_hours, status: r.status,
      })));
    } else {
      const result = await leaveReport({ from, to });
      setRows(result.data.map((l) => ({
        employee: l.user?.name, employee_id: l.user?.employee_id, leave_type: l.leave_type?.name,
        start_date: l.start_date, end_date: l.end_date, total_days: l.total_days, status: l.status,
      })));
    }
  };

  const handleExport = () => {
    if (!rows?.length) return;
    const columns = Object.keys(rows[0]);
    downloadCsv(`${type}_report_${from}_to_${to}.csv`, toCsv(rows, columns));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Generate and export attendance or leave reports.</p>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
          <button className="btn-primary" onClick={run}>Generate Report</button>
        </div>
      </div>

      {rows !== null && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-ink">{rows.length} result{rows.length === 1 ? '' : 's'}</p>
            <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={handleExport} disabled={!rows.length}>
              <Download size={14} /> Export CSV
            </button>
          </div>
          {rows === null ? (
            <Spinner />
          ) : type === 'attendance' ? (
            <Table
              columns={['Employee', 'Date', 'Time In', 'Time Out', 'Hours', 'Status']}
              data={rows}
              renderRow={(r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="td">{r.employee} <span className="text-xs text-slate-400">({r.employee_id})</span></td>
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
                  <td className="td">{r.employee} <span className="text-xs text-slate-400">({r.employee_id})</span></td>
                  <td className="td">{r.leave_type}</td>
                  <td className="td">{r.start_date}</td>
                  <td className="td">{r.end_date}</td>
                  <td className="td">{r.total_days}</td>
                  <td className="td"><Badge status={r.status} /></td>
                </tr>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
