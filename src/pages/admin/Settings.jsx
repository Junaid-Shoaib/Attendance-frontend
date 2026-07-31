import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import {
  listDepartments, createDepartment, listDesignations, createDesignation,
  listOffices, createOffice, listHolidays, createHoliday,
} from '../../api/resources';

const TABS = ['Departments', 'Designations', 'Offices (Geofencing)', 'Holidays'];

export default function AdminSettings() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Company Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Departments, designations, office geofence locations, and holidays.</p>
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

      {tab === 'Departments' && <DepartmentsPanel />}
      {tab === 'Designations' && <DesignationsPanel />}
      {tab === 'Offices (Geofencing)' && <OfficesPanel />}
      {tab === 'Holidays' && <HolidaysPanel />}
    </div>
  );
}

function DepartmentsPanel() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const load = () => listDepartments().then(setItems);
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
            <li key={d.id} className="py-3 flex justify-between text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="text-slate-400">{d.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DesignationsPanel() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');

  const load = () => listDesignations().then(setItems);
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
            <li key={d.id} className="py-3 text-sm font-medium">{d.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OfficesPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', latitude: '', longitude: '', radius_meters: 200 });

  const load = () => listOffices().then(setItems);
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
              <p className="font-semibold">{o.name}</p>
              <p className="text-xs text-slate-400">{o.latitude}, {o.longitude} · {o.radius_meters}m radius</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HolidaysPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', is_recurring_yearly: false });

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
            <li key={h.id} className="py-3 flex justify-between text-sm">
              <span className="font-medium">{h.name}</span>
              <span className="text-slate-400">{h.date}{h.is_recurring_yearly ? ' · yearly' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
