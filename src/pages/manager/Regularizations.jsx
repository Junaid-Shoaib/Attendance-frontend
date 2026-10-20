import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { listRegularizations, reviewRegularization } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const fmtDate = (d) => { try { return format(parseISO(d), 'dd MMM yyyy'); } catch { return d; } };
const fmtTime = (d) => { if (!d) return '—'; try { return format(new Date(d), 'hh:mm a'); } catch { return '—'; } };
const toHHMM = (d) => { if (!d) return ''; try { return format(new Date(d), 'HH:mm'); } catch { return ''; } };

export default function Regularizations() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // the regularization being approved-with-edits
  const [form, setForm] = useState({ attendance_date: '', time_in: '', time_out: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setItems(null);
    const result = await listRegularizations({ per_page: 30 });
    setItems(result.data);
  };

  useEffect(() => { load(); }, []);

  const handleReject = async (id) => {
    try {
      await reviewRegularization(id, 'reject', 'Rejected');
      toast.success('Request rejected');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Section 7: Manager can edit the requested Time In / Time Out (and
  // date) before approving - opens a modal pre-filled with what the
  // employee submitted so the manager can correct it.
  const openApprove = (r) => {
    setEditing(r);
    setForm({
      attendance_date: r.attendance_date,
      time_in: toHHMM(r.requested_time_in),
      time_out: toHHMM(r.requested_time_out),
    });
  };

  const submitApprove = async (e) => {
    e.preventDefault();
    if (form.time_out && form.time_in && form.time_out <= form.time_in) {
      toast.error('Time Out must be after Time In.');
      return;
    }
    setSaving(true);
    try {
      await reviewRegularization(editing.id, 'approve', 'Verified and approved', {
        attendance_date: form.attendance_date,
        time_in: form.time_in || undefined,
        time_out: form.time_out || undefined,
      });
      toast.success('Request approved with corrected time');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Attendance Corrections</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review missed attendance regularization requests from your team. You can correct the Time In / Time Out before approving.
        </p>
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
                      <button className="btn-outline !py-1.5 !px-3 text-xs mr-2" onClick={() => handleReject(r.id)}>Decline</button>
                      <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => openApprove(r)}>Review & Approve</button>
                    </>
                  )}
                </td>
              </tr>
            )}
          />
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Review & Approve Correction">
        {editing && (
          <form onSubmit={submitApprove} className="space-y-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-ink">{editing.user?.name}</span> requested:
              {' '}{fmtTime(editing.requested_time_in)} – {fmtTime(editing.requested_time_out)}
              {' '}on {fmtDate(editing.attendance_date)}.
              {' '}Adjust below if needed, then approve.
            </p>

            <div>
              <label className="label">Date</label>
              <input
                type="date" className="input" required
                value={form.attendance_date}
                onChange={(e) => setForm({ ...form, attendance_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Time In</label>
                <input
                  type="time" className="input" required
                  value={form.time_in}
                  onChange={(e) => setForm({ ...form, time_in: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Time Out</label>
                <input
                  type="time" className="input" required
                  value={form.time_out}
                  onChange={(e) => setForm({ ...form, time_out: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Approving…' : 'Approve With These Values'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
