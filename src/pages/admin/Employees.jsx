import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Ban, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { listUsers, createUser, updateUser, disableUser, enableUser, listDepartments, listDesignations } from '../../api/resources';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import SearchInput from '../../components/SearchInput';

const ROLES = ['employee', 'manager', 'super_admin'];
const EMPTY_FORM = {
  employee_id: '', name: '', email: '', phone: '', password: '',
  role: 'employee', department_id: '', designation_id: '', joining_date: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState(null);
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async (q = '') => {
    const result = await listUsers({ search: q, per_page: 50 });
    setEmployees(result.data);
  };

  useEffect(() => {
    load();
    listDepartments().then(setDepartments);
    listDesignations().then(setDesignations);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      employee_id: emp.employee_id, name: emp.name, email: emp.email, phone: emp.phone || '',
      password: '', role: emp.role, department_id: emp.department_id || '',
      designation_id: emp.designation_id || '', joining_date: emp.joining_date || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateUser(editing.id, form);
        toast.success('Employee updated');
      } else {
        await createUser(form);
        toast.success('Employee created');
      }
      setModalOpen(false);
      load(search);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (emp) => {
    try {
      if (emp.status === 'active') {
        await disableUser(emp.id);
        toast.success('Employee disabled');
      } else {
        await enableUser(emp.id);
        toast.success('Employee enabled');
      }
      load(search);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee accounts, roles, and departments.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <SearchInput value={search} onChange={(v) => { setSearch(v); load(v); }} placeholder="Search by name, email, or employee ID..." />
        </div>

        {employees === null ? (
          <Spinner />
        ) : (
          <Table
            columns={['Employee', 'Role', 'Department', 'Status', '']}
            data={employees}
            renderRow={(emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/60">
                <td className="td">
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-xs text-slate-400">{emp.employee_id} · {emp.email}</p>
                </td>
                <td className="td capitalize">{emp.role.replace('_', ' ')}</td>
                <td className="td">{emp.department?.name || '—'}</td>
                <td className="td"><Badge status={emp.status} /></td>
                <td className="td text-right whitespace-nowrap">
                  <button className="btn-ghost !px-2" onClick={() => openEdit(emp)} title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="btn-ghost !px-2" onClick={() => toggleStatus(emp)} title={emp.status === 'active' ? 'Disable' : 'Enable'}>
                    {emp.status === 'active' ? <Ban size={15} className="text-red-500" /> : <CheckCircle2 size={15} className="text-emerald-500" />}
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employee ID</label>
              <input className="input" required disabled={!!editing} value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })} />
            </div>
            <div>
              <label className="label">Full Name</label>
              <input className="input" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          {!editing && (
            <div>
              <label className="label">Temporary Password</label>
              <input className="input" type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}>
                <option value="">—</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Designation</label>
              <select className="input" value={form.designation_id} onChange={(e) => setForm({ ...form, designation_id: e.target.value })}>
                <option value="">—</option>
                {designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Joining Date</label>
              <input className="input" type="date" value={form.joining_date}
                onChange={(e) => setForm({ ...form, joining_date: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {editing ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
