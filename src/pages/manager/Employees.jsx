import React, { useEffect, useState } from 'react';
import { managerEmployeeDirectory } from '../../api/resources';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import SearchInput from '../../components/SearchInput';

// Read-only, Employee-role-only directory: Managers use this to verify a
// physically-present teammate actually has an account. Only Admin can
// create/edit/delete employees, so no such controls appear here - and the
// backend already refuses to return anyone who isn't role=employee, so
// this page can never leak Admin/Manager records regardless of the UI.
export default function ManagerEmployees() {
  const [employees, setEmployees] = useState(null);
  const [search, setSearch] = useState('');

  const load = async (q = '') => {
    const result = await managerEmployeeDirectory({ search: q, per_page: 50 });
    setEmployees(result.data);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (q) => { setSearch(q); load(q); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">
            All Employee-role accounts, for verification. Only Admin can create, edit, or delete employees.
          </p>
        </div>
        <SearchInput value={search} onChange={handleSearch} placeholder="Search by name, email or ID…" />
      </div>

      {employees === null ? (
        <Spinner />
      ) : (
        <Table
          columns={['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Status']}
          data={employees}
          renderRow={(e) => (
            <tr key={e.id} className="hover:bg-slate-50/60">
              <td className="td font-medium">{e.employee_id}</td>
              <td className="td">{e.name}</td>
              <td className="td text-slate-500">{e.email}</td>
              <td className="td">{e.department?.name || '—'}</td>
              <td className="td">{e.designation?.title || '—'}</td>
              <td className="td">
                <span className={`text-xs font-semibold ${e.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                  {e.status === 'active' ? 'Active' : 'Disabled'}
                </span>
              </td>
            </tr>
          )}
          emptyMessage="No employees found. If someone is physically on your team but missing here, ask Admin to create their account."
        />
      )}
    </div>
  );
}
