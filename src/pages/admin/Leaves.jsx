import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { adminListLeaves, adminReviewLeave } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';

const fmt = (d) => { try { return format(parseISO(d), 'dd MMM yyyy'); } catch { return d; } };

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState(null);
  const [status, setStatus] = useState('manager_approved');

  const load = async (s) => {
    setLeaves(null);
    const result = await adminListLeaves(s === 'all' ? {} : { status: s });
    setLeaves(result.data);
  };

  useEffect(() => { load(status); }, [status]);

  const handleReview = async (id, action) => {
    try {
      await adminReviewLeave(id, action, action === 'approve' ? 'Final approval granted' : 'Not approved');
      toast.success(`Leave ${action}d`);
      load(status);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Leave Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Company-wide leave requests and final approval.</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['manager_approved', 'pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold capitalize ${
              status === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {leaves === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Type', 'Dates', 'Status', '']}
            data={leaves}
            emptyMessage="No leave requests found."
            renderRow={(l) => (
              <tr key={l.id} className="hover:bg-slate-50/60">
                <td className="td">
                  <p className="font-semibold">{l.user?.name}</p>
                  <p className="text-xs text-slate-400 max-w-xs truncate">{l.reason}</p>
                </td>
                <td className="td">{l.leave_type?.name}</td>
                <td className="td">{fmt(l.start_date)} → {fmt(l.end_date)} ({l.total_days}d)</td>
                <td className="td"><Badge status={l.status} /></td>
                <td className="td text-right whitespace-nowrap">
                  {['pending', 'manager_approved'].includes(l.status) && (
                    <>
                      <button className="btn-outline !py-1.5 !px-3 text-xs mr-2" onClick={() => handleReview(l.id, 'reject')}>Reject</button>
                      <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => handleReview(l.id, 'approve')}>Approve</button>
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
