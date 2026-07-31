import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { teamAttendance } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';

function fmtTime(dt) {
  if (!dt) return '--:--';
  try { return format(new Date(dt), 'hh:mm a'); } catch { return '--:--'; }
}

export default function TeamAttendance() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState(null);

  const load = async (d) => {
    setRecords(null);
    setRecords(await teamAttendance({ date: d }));
  };

  useEffect(() => { load(date); }, [date]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Team Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Attendance for your direct reports.</p>
        </div>
        <input type="date" className="input w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        {records === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Time In', 'Time Out', 'Status']}
            data={records}
            emptyMessage="No attendance marked for this date."
            renderRow={(r) => (
              <tr key={r.id} className="hover:bg-slate-50/60">
                <td className="td font-semibold">{r.user?.name}</td>
                <td className="td">{fmtTime(r.time_in)}</td>
                <td className="td">{fmtTime(r.time_out)}</td>
                <td className="td"><Badge status={r.status} /></td>
              </tr>
            )}
          />
        )}
      </div>
    </div>
  );
}
