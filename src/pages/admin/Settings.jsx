import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Check, Clock } from 'lucide-react';
import {
  listDepartments, createDepartment, updateDepartment, deleteDepartment,
  listDesignations, createDesignation, updateDesignation, deleteDesignation,
  listOffices, createOffice, updateOffice, deleteOffice,
  listHolidays, createHoliday, updateHoliday, deleteHoliday,
  getAttendanceSettings, updateAttendanceSettings,
} from '../../api/resources';

const TABS = ['Working Hours', 'Departments', 'Designations', 'Offices (Geofencing)', 'Holidays'];

export default function AdminSettings() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Company Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Working hours, departments, designations, office geofence locations, and holidays.</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Working Hours' && <WorkingHoursPanel />}
      {tab === 'Departments' && <DepartmentsPanel />}
      {tab === 'Designations' && <DesignationsPanel />}
      {tab === 'Offices (Geofencing)' && <OfficesPanel />}
      {tab === 'Holidays' && <HolidaysPanel />}
    </div>
  );
}

// ---------------------------------------------------------------------
// Working Hours (Section 1) - Full-time start/end + half-day threshold.
// Admin can change these without any code change; attendance
// calculations (late / half-day) read them live from the backend.
// ---------------------------------------------------------------------
function WorkingHoursPanel() {
  const [form, setForm] = useState({ full_time_start: '', full_time_end: '', half_day_hours: '', late_grace_minutes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => getAttendanceSettings().then((data) => { setForm(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await updateAttendanceSettings(form);
      setForm(saved);
      toast.success('Working hours updated. This now drives attendance calculations.');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card text-sm text-slate-400">Loading…</div>;

  return (
    <form onSubmit={handleSave} className="card max-w-lg space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock size={18} className="text-primary-600" />
        <h3 className="font-bold text-sm">Attendance Working Hours</h3>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Full Time Start Time</label>
        <input
          className="input" type="time" required
          value={form.full_time_start}
          onChange={(e) => setForm({ ...form, full_time_start: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Full Time End Time</label>
        <input
          className="input" type="time" required
          value={form.full_time_end}
          onChange={(e) => setForm({ ...form, full_time_end: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Half Day Hours (minimum hours worked to NOT be marked half-day)</label>
        <input
          className="input" type="number" step="0.5" min="1" max="23" required
          value={form.half_day_hours}
          onChange={(e) => setForm({ ...form, half_day_hours: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Late Grace Period (minutes)</label>
        <input
          className="input" type="number" min="0" max="180"
          value={form.late_grace_minutes}
          onChange={(e) => setForm({ ...form, late_grace_minutes: e.target.value })}
        />
      </div>

      <button className="btn-primary w-full" disabled={saving}>
        {saving ? 'Saving…' : 'Save Working Hours'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------
// Shared little inline-edit row helper used by all four CRUD panels
// below, so each stays small and consistent.
// ---------------------------------------------------------------------
function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="text-slate-400 hover:text-primary-600" title="Edit"><Pencil size={15} /></button>
      <button onClick={onDelete} className="text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
    </div>
  );
}

function DepartmentsPanel() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', code: '' });

  const load = () => listDepartments({ all: 1 }).then(setItems);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createDepartment({ name, code: code || undefined });
      toast.success('Department added');
      setName(''); setCode('');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const startEdit = (d) => { setEditingId(d.id); setEditForm({ name: d.name, code: d.code || '' }); };

  const saveEdit = async (id) => {
    try {
      await updateDepartment(id, { name: editForm.name, code: editForm.code || null });
      toast.success('Department updated');
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete department "${d.name}"?`)) return;
    try {
      const res = await deleteDepartment(d.id);
      toast.success(res.message || 'Department deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAdd} className="card space-y-3 h-fit">
        <h3 className="font-bold text-sm">Add Department</h3>
        <input className="input" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Code (optional)" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="btn-primary w-full"><Plus size={15} /> Add</button>
      </form>
      <div className="lg:col-span-2 card">
        <ul className="divide-y divide-slate-100">
          {items.map((d) => (
            <li key={d.id} className="py-3 flex justify-between items-center text-sm gap-3">
              {editingId === d.id ? (
                <>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <input className="input" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(d.id)} className="text-green-600"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-medium">{d.name}</span>
                    {!d.is_active && <span className="ml-2 text-xs text-amber-600">(inactive)</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{d.code}</span>
                    <RowActions onEdit={() => startEdit(d)} onDelete={() => handleDelete(d)} />
                  </div>
                </>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-center text-slate-400 text-sm">No departments yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function DesignationsPanel() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const load = () => listDesignations({ all: 1 }).then(setItems);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createDesignation({ title });
      toast.success('Designation added');
      setTitle('');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const saveEdit = async (id) => {
    try {
      await updateDesignation(id, { title: editTitle });
      toast.success('Designation updated');
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete designation "${d.title}"?`)) return;
    try {
      const res = await deleteDesignation(d.id);
      toast.success(res.message || 'Designation deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAdd} className="card space-y-3 h-fit">
        <h3 className="font-bold text-sm">Add Designation</h3>
        <input className="input" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn-primary w-full"><Plus size={15} /> Add</button>
      </form>
      <div className="lg:col-span-2 card">
        <ul className="divide-y divide-slate-100">
          {items.map((d) => (
            <li key={d.id} className="py-3 flex justify-between items-center text-sm gap-3">
              {editingId === d.id ? (
                <>
                  <input className="input flex-1" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(d.id)} className="text-green-600"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-medium">{d.title}{!d.is_active && <span className="ml-2 text-xs text-amber-600">(inactive)</span>}</span>
                  <RowActions onEdit={() => { setEditingId(d.id); setEditTitle(d.title); }} onDelete={() => handleDelete(d)} />
                </>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-center text-slate-400 text-sm">No designations yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function OfficesPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', latitude: '', longitude: '', radius_meters: 200 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = () => listOffices({ all: 1 }).then(setItems);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createOffice(form);
      toast.success('Office location added');
      setForm({ name: '', address: '', latitude: '', longitude: '', radius_meters: 200 });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const startEdit = (o) => {
    setEditingId(o.id);
    setEditForm({ name: o.name, address: o.address || '', latitude: o.latitude, longitude: o.longitude, radius_meters: o.radius_meters });
  };

  const saveEdit = async (id) => {
    try {
      // Geofencing fields are sent exactly as edited; anything not shown
      // here (name/address) is preserved automatically since the backend
      // only updates fields actually present in the request.
      await updateOffice(id, editForm);
      toast.success('Office updated - geofencing preserved');
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (o) => {
    if (!window.confirm(`Delete office "${o.name}"? This removes its geofence.`)) return;
    try {
      const res = await deleteOffice(o.id);
      toast.success(res.message || 'Office deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAdd} className="card space-y-3 h-fit">
        <h3 className="font-bold text-sm">Add Office / Branch</h3>
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Latitude" type="number" step="any" required value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          <input className="input" placeholder="Longitude" type="number" step="any" required value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        </div>
        <input className="input" placeholder="Radius (meters)" type="number" value={form.radius_meters} onChange={(e) => setForm({ ...form, radius_meters: e.target.value })} />
        <button className="btn-primary w-full"><Plus size={15} /> Add Location</button>
      </form>
      <div className="lg:col-span-2 card">
        <ul className="divide-y divide-slate-100">
          {items.map((o) => (
            <li key={o.id} className="py-3 text-sm">
              {editingId === o.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <input className="input" placeholder="Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input className="input" type="number" step="any" placeholder="Latitude" value={editForm.latitude} onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })} />
                    <input className="input" type="number" step="any" placeholder="Longitude" value={editForm.longitude} onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })} />
                    <input className="input" type="number" placeholder="Radius (m)" value={editForm.radius_meters} onChange={(e) => setEditForm({ ...editForm, radius_meters: e.target.value })} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveEdit(o.id)} className="btn-primary !py-1 !px-3 text-xs">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{o.name}{!o.is_active && <span className="ml-2 text-xs text-amber-600">(inactive)</span>}</p>
                    <p className="text-xs text-slate-400">{o.latitude}, {o.longitude} · {o.radius_meters}m radius</p>
                    {o.address && <p className="text-xs text-slate-400">{o.address}</p>}
                  </div>
                  <RowActions onEdit={() => startEdit(o)} onDelete={() => handleDelete(o)} />
                </div>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-center text-slate-400 text-sm">No offices yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function HolidaysPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', is_recurring_yearly: false });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = () => listHolidays().then(setItems);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createHoliday(form);
      toast.success('Holiday added');
      setForm({ name: '', date: '', is_recurring_yearly: false });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const startEdit = (h) => { setEditingId(h.id); setEditForm({ name: h.name, date: h.date, is_recurring_yearly: h.is_recurring_yearly }); };

  const saveEdit = async (id) => {
    try {
      await updateHoliday(id, editForm);
      toast.success('Holiday updated');
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (h) => {
    if (!window.confirm(`Delete holiday "${h.name}"?`)) return;
    try {
      await deleteHoliday(h.id);
      toast.success('Holiday deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAdd} className="card space-y-3 h-fit">
        <h3 className="font-bold text-sm">Add Holiday</h3>
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.is_recurring_yearly} onChange={(e) => setForm({ ...form, is_recurring_yearly: e.target.checked })} />
          Repeats every year
        </label>
        <button className="btn-primary w-full"><Plus size={15} /> Add Holiday</button>
      </form>
      <div className="lg:col-span-2 card">
        <ul className="divide-y divide-slate-100">
          {items.map((h) => (
            <li key={h.id} className="py-3 flex justify-between items-center text-sm gap-3">
              {editingId === h.id ? (
                <>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <input className="input" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(h.id)} className="text-green-600"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-medium">{h.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{h.date}{h.is_recurring_yearly ? ' · yearly' : ''}</span>
                    <RowActions onEdit={() => startEdit(h)} onDelete={() => handleDelete(h)} />
                  </div>
                </>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-center text-slate-400 text-sm">No holidays yet.</li>}
        </ul>
      </div>
    </div>
  );
}
