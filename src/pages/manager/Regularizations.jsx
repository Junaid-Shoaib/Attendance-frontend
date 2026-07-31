import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { listRegularizations, reviewRegularization } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';

const fmtDate = (d) => { try { return format(parseISO(d), 'dd MMM yyyy'); } catch { return d; } };
const fmtTime = (d) => { if (!d) return '—'; try { return format(new Date(d), 'hh:mm a'); } catch { return '—'; } };

export default function Regularizations() {
  const [items, setItems] = useState(null);

  const load = async () => {
    setItems(null);
    const result = await listRegularizations({ per_page: 30 });
    setItems(result.data);
  };

  useEffect(() => { load(); }, []);

  const handleReview = async (id, action) => {
    try {
      await reviewRegularization(id, action, action === 'approve' ? 'Verified and approved' : 'Rejected');
      toast.success(`Request ${action}d`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Attendance Corrections</h1>
        <p className="text-sm text-slate-500 mt-1">Review missed attendance regularization requests from your team.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {items === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Date', 'Requested In/Out', 'Reason', 'Status', '']}
            data={items}
            emptyMessage="No pending correction requests."
            renderRow={(r) => (
              <tr key={r.id} className="hover:bg-slate-50/60">
                <td className="td font-semibold">{r.user?.name}</td>
                <td className="td">{fmtDate(r.attendance_date)}</td>
                <td className="td">{fmtTime(r.requested_time_in)} – {fmtTime(r.requested_time_out)}</td>
                <td className="td max-w-xs truncate">{r.reason}</td>
                <td className="td"><Badge status={r.status} /></td>
                <td className="td text-right whitespace-nowrap">
                  {r.status === 'pending' && (
                    <>
                      <button className="btn-outline !py-1.5 !px-3 text-xs mr-2" onClick={() => handleReview(r.id, 'reject')}>Reject</button>
                      <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => handleReview(r.id, 'approve')}>Approve</button>
                    </>
                  )}
                </td>
              </tr>
            )}
          />
        )}
      </div>
    </div>
  );
}
