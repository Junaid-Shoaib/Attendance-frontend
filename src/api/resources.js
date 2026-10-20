import api from './client';

// --- Dashboards ---
export const getAdminDashboard = () => api.get('/admin/dashboard').then((r) => r.data.data);
export const getManagerDashboard = () => api.get('/manager/dashboard').then((r) => r.data.data);

// --- Employees (Admin) ---
export const listUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data.data);
export const getUser = (id) => api.get(`/admin/users/${id}`).then((r) => r.data.data);
export const createUser = (payload) => api.post('/admin/users', payload).then((r) => r.data.data);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then((r) => r.data.data);
export const disableUser = (id) => api.patch(`/admin/users/${id}/disable`).then((r) => r.data.data);
export const enableUser = (id) => api.patch(`/admin/users/${id}/enable`).then((r) => r.data.data);
export const assignManager = (id, manager_id) => api.patch(`/admin/users/${id}/assign-manager`, { manager_id }).then((r) => r.data.data);
export const assignDepartment = (id, payload) => api.patch(`/admin/users/${id}/assign-department`, payload).then((r) => r.data.data);

// --- Devices (Admin) ---
export const listDevices = (params) => api.get('/admin/devices', { params }).then((r) => r.data.data);
export const approveDevice = (id) => api.patch(`/admin/devices/${id}/approve`).then((r) => r.data.data);
export const revokeDevice = (id) => api.patch(`/admin/devices/${id}/revoke`).then((r) => r.data.data);

// --- Leaves ---
export const adminListLeaves = (params) => api.get('/admin/leaves', { params }).then((r) => r.data.data);
export const adminReviewLeave = (id, action, remarks, dates) => api.patch(`/admin/leaves/${id}/review`, { action, remarks, ...dates }).then((r) => r.data.data);
export const managerListLeaves = (params) => api.get('/manager/leaves', { params }).then((r) => r.data.data);
export const managerReviewLeave = (id, action, remarks, dates) => api.patch(`/manager/leaves/${id}/review`, { action, remarks, ...dates }).then((r) => r.data.data);
export const listLeaveTypes = () => api.get('/leaves/types').then((r) => r.data.data);
export const createLeaveType = (payload) => api.post('/admin/leave-types', payload).then((r) => r.data.data);

// --- Regularizations ---
export const listRegularizations = (params) => api.get('/manager/regularizations', { params }).then((r) => r.data.data);
export const reviewRegularization = (id, action, remarks, corrections) => api.patch(`/manager/regularizations/${id}/review`, { action, remarks, ...corrections }).then((r) => r.data.data);

// --- Attendance ---
export const teamAttendance = (params) => api.get('/manager/team-attendance', { params }).then((r) => r.data.data);
export const adminAttendance = (params) => api.get('/admin/attendance', { params }).then((r) => r.data.data);
export const attendanceReport = (params) => api.get('/admin/reports/attendance', { params }).then((r) => r.data.data);
export const leaveReport = (params) => api.get('/admin/reports/leaves', { params }).then((r) => r.data.data);
export const managerAttendanceReport = (params) => api.get('/manager/reports/attendance', { params }).then((r) => r.data.data);
export const managerLeaveReport = (params) => api.get('/manager/reports/leaves', { params }).then((r) => r.data.data);

// Exports: use an authenticated blob download (not a plain URL) so the
// Bearer token travels with the request the same way every other API call
// does, then trigger a normal browser "Save File" via an object URL.
export const downloadAttendanceReport = (params, scope = 'admin') => downloadExport(`/${scope}/reports/attendance`, params, 'attendance-report');
export const downloadLeaveReport = (params, scope = 'admin') => downloadExport(`/${scope}/reports/leaves`, params, 'leave-report');

async function downloadExport(path, params, filenamePrefix) {
  const format = params.export || 'xlsx';
  const response = await api.get(path, { params: { ...params, export: format }, responseType: 'blob' });
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'xlsx'}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// --- Company settings ---
export const listDepartments = (params) => api.get('/departments', { params }).then((r) => r.data.data);
export const createDepartment = (payload) => api.post('/admin/departments', payload).then((r) => r.data.data);
export const updateDepartment = (id, payload) => api.put(`/admin/departments/${id}`, payload).then((r) => r.data.data);
export const deleteDepartment = (id) => api.delete(`/admin/departments/${id}`).then((r) => r.data);

export const listDesignations = (params) => api.get('/designations', { params }).then((r) => r.data.data);
export const createDesignation = (payload) => api.post('/admin/designations', payload).then((r) => r.data.data);
export const updateDesignation = (id, payload) => api.put(`/admin/designations/${id}`, payload).then((r) => r.data.data);
export const deleteDesignation = (id) => api.delete(`/admin/designations/${id}`).then((r) => r.data);

export const listOffices = (params) => api.get('/offices', { params }).then((r) => r.data.data);
export const createOffice = (payload) => api.post('/admin/offices', payload).then((r) => r.data.data);
export const updateOffice = (id, payload) => api.put(`/admin/offices/${id}`, payload).then((r) => r.data.data);
export const deleteOffice = (id) => api.delete(`/admin/offices/${id}`).then((r) => r.data);

export const listHolidays = () => api.get('/holidays').then((r) => r.data.data);
export const createHoliday = (payload) => api.post('/admin/holidays', payload).then((r) => r.data.data);
export const updateHoliday = (id, payload) => api.put(`/admin/holidays/${id}`, payload).then((r) => r.data.data);
export const deleteHoliday = (id) => api.delete(`/admin/holidays/${id}`).then((r) => r.data);

// --- Attendance working hours settings ---
export const getAttendanceSettings = () => api.get('/admin/settings/attendance').then((r) => r.data.data);
export const updateAttendanceSettings = (payload) => api.put('/admin/settings/attendance', payload).then((r) => r.data.data);

// --- Manager team ---
export const myTeam = () => api.get('/manager/team').then((r) => r.data.data);
export const managerEmployeeDirectory = (params) => api.get('/manager/employees', { params }).then((r) => r.data.data);
