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
export const adminReviewLeave = (id, action, remarks) => api.patch(`/admin/leaves/${id}/review`, { action, remarks }).then((r) => r.data.data);
export const managerListLeaves = (params) => api.get('/manager/leaves', { params }).then((r) => r.data.data);
export const managerReviewLeave = (id, action, remarks) => api.patch(`/manager/leaves/${id}/review`, { action, remarks }).then((r) => r.data.data);
export const listLeaveTypes = () => api.get('/leaves/types').then((r) => r.data.data);
export const createLeaveType = (payload) => api.post('/admin/leave-types', payload).then((r) => r.data.data);

// --- Regularizations ---
export const listRegularizations = (params) => api.get('/manager/regularizations', { params }).then((r) => r.data.data);
export const reviewRegularization = (id, action, remarks) => api.patch(`/manager/regularizations/${id}/review`, { action, remarks }).then((r) => r.data.data);

// --- Attendance ---
export const teamAttendance = (params) => api.get('/manager/team-attendance', { params }).then((r) => r.data.data);
export const adminAttendance = (params) => api.get('/admin/attendance', { params }).then((r) => r.data.data);
export const attendanceReport = (params) => api.get('/admin/reports/attendance', { params }).then((r) => r.data.data);
export const leaveReport = (params) => api.get('/admin/reports/leaves', { params }).then((r) => r.data.data);

// --- Company settings ---
export const listDepartments = () => api.get('/departments').then((r) => r.data.data);
export const createDepartment = (payload) => api.post('/admin/departments', payload).then((r) => r.data.data);
export const listDesignations = () => api.get('/designations').then((r) => r.data.data);
export const createDesignation = (payload) => api.post('/admin/designations', payload).then((r) => r.data.data);
export const listOffices = () => api.get('/offices').then((r) => r.data.data);
export const createOffice = (payload) => api.post('/admin/offices', payload).then((r) => r.data.data);
export const updateOffice = (id, payload) => api.put(`/admin/offices/${id}`, payload).then((r) => r.data.data);
export const listHolidays = () => api.get('/holidays').then((r) => r.data.data);
export const createHoliday = (payload) => api.post('/admin/holidays', payload).then((r) => r.data.data);

// --- Manager team ---
export const myTeam = () => api.get('/manager/team').then((r) => r.data.data);
