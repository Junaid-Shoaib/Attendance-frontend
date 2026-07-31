import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { listDevices, approveDevice, revokeDevice } from '../../api/resources';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';

export default function Devices() {
  const [devices, setDevices] = useState(null);
  const [filter, setFilter] = useState('pending');

  const load = async (status) => {
    setDevices(null);
    const result = await listDevices(status === 'all' ? {} : { status });
    setDevices(result.data);
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await approveDevice(id);
      toast.success('Device approved');
      load(filter);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await revokeDevice(id);
      toast.success('Device access revoked');
      load(filter);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Device Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">
          New devices must be approved before an employee can log in or mark attendance from them.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {['pending', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold capitalize ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {devices === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Device', 'Platform', 'Flags', '']}
            data={devices}
            emptyMessage="No devices to review."
            renderRow={(d) => (
              <tr key={d.id} className="hover:bg-slate-50/60">
                <td className="td">
                  <p className="font-semibold">{d.user?.name}</p>
                  <p className="text-xs text-slate-400">{d.user?.employee_id}</p>
                </td>
                <td className="td">{d.device_name || 'Unknown device'}</td>
                <td className="td capitalize">{d.platform} {d.os_version}</td>
                <td className="td">
                  {d.is_rooted_or_jailbroken ? (
                    <span className="badge bg-red-50 text-red-700"><AlertTriangle size={12} /> Rooted/Jailbroken</span>
                  ) : d.is_approved ? (
                    <span className="badge bg-emerald-50 text-emerald-700"><ShieldCheck size={12} /> Approved</span>
                  ) : (
                    <span className="badge bg-amber-50 text-amber-700">Pending</span>
                  )}
                </td>
                <td className="td text-right whitespace-nowrap">
                  {!d.is_approved ? (
                    <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => handleApprove(d.id)}>Approve</button>
                  ) : (
                    <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={() => handleRevoke(d.id)}>Revoke</button>
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
