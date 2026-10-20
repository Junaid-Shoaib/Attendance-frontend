import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { managerListLeaves, managerReviewLeave } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const fmt = (d) => { try { return format(parseISO(d), 'dd MMM yyyy'); } catch { return d; } };
const toISO = (d) => { try { return format(parseISO(d), 'yyyy-MM-dd'); } catch { return d; } };

export default function ManagerLeaves() {
  const [leaves, setLeaves] = useState(null);
  const [status, setStatus] = useState('pending');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ start_date: '', end_date: '' });
  const [saving, setSaving] = useState(false);

  const load = async (s) => {
    setLeaves(null);
    const result = await managerListLeaves(s === 'all' ? {} : { status: s });
    setLeaves(result.data);
  };

  useEffect(() => { load(status); }, [status]);

  const handleReject = async (id) => {
    try {
      await managerReviewLeave(id, 'reject', 'Not approved at this time');
      toast.success('Leave rejected');
      load(status);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Section 9: Manager can adjust Start/End Date before approving.
  const openApprove = (l) => {
    setEditing(l);
    setForm({ start_date: toISO(l.start_date), end_date: toISO(l.end_date) });
  };

  const submitApprove = async (e) => {
    e.preventDefault();
    if (form.end_date < form.start_date) {
      toast.error('End Date cannot be before Start Date.');
      return;
    }
    setSaving(true);
    try {
      await managerReviewLeave(editing.id, 'approve', 'Approved', {
        start_date: form.start_date,
        end_date: form.end_date,
      });
      toast.success('Leave approved');
      setEditing(null);
      load(status);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Leave Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review your team's leave requests. You can adjust the dates before approving.</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold capitalize ${
              status === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {leaves === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Type', 'Dates', 'Reason', 'Status', '']}
            data={leaves}
            emptyMessage="No leave requests found."
            renderRow={(l) => (
              <tr key={l.id} className="hover:bg-slate-50/60">
                <td className="td font-semibold">{l.user?.name}</td>
                <td className="td">{l.leave_type?.name}</td>
                <td className="td">{fmt(l.start_date)} → {fmt(l.end_date)} ({l.total_days}d)</td>
                <td className="td max-w-xs truncate">{l.reason}</td>
                <td className="td"><Badge status={l.status} /></td>
                <td className="td text-right whitespace-nowrap">
                  {l.status === 'pending' && (
                    <>
                      <button className="btn-outline !py-1.5 !px-3 text-xs mr-2" onClick={() => handleReject(l.id)}>Reject</button>
                      <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => openApprove(l)}>Review & Approve</button>
                    </>
                  )}
                </td>
              </tr>
            )}
          />
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Review & Approve Leave">
        {editing && (
          <form onSubmit={submitApprove} className="space-y-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-ink">{editing.user?.name}</span> requested{' '}
              {fmt(editing.start_date)} → {fmt(editing.end_date)}. Adjust below if needed, then approve.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date" className="input" required
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date" className="input" required
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Approving…' : 'Approve With These Dates'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
