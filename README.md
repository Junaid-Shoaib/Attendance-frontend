# Attendance Management System — Admin & Manager Web Portal

A browser-based dashboard for Super Admins and Managers, built with React,
Vite, Tailwind CSS, and React Router. Talks to the same Laravel 12 API as
the mobile app (`../backend`) — employees continue to use the mobile app
for Time In/Out, leave, and profile; this portal is for the desk-based
admin/manager workflows.

## Features

- **Login** — restricted to `super_admin` and `manager` roles (employees
  are redirected to use the mobile app)
- **Admin portal** (`/admin`):
  - Company-wide dashboard (headcount, present/absent/late, attendance %,
    pending approvals)
  - Employee management — search, create, edit, disable/enable, assign
    role/department/designation
  - Device approval queue (device binding) with root/jailbreak flags
  - Company-wide leave requests with final approval
  - Company-wide daily attendance view
  - Reports — attendance & leave, filterable by date range, exportable to CSV
  - Settings — departments, designations, office/geofence locations
    (multi-branch), holidays
- **Manager portal** (`/manager`):
  - Team dashboard (team size, present today, pending approvals)
  - Team attendance for any date
  - Leave approval queue
  - Attendance correction (regularization) approval queue

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:8000/api/v1

npm run dev
# Open http://localhost:5173
```

Log in with the seeded demo accounts from the backend:

| Role    | Email                  | Password     |
|---------|-------------------------|--------------|
| Admin   | admin@attendance.app    | Password@123 |
| Manager | manager@attendance.app  | Password@123 |

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

Deploy the `dist/` folder to any static host (Nginx, S3+CloudFront,
Vercel, Netlify, etc.) and point it at your production API via
`VITE_API_BASE_URL` at build time.

## Notes on device binding for the web

The backend's attendance-time device binding is mobile-focused, but login
itself also registers a device fingerprint. The web portal sends a fixed
`device_id: "web-portal"` per browser (see `src/api/auth.js`) so admins/
managers logging in from the office computer aren't treated as a "new
device" on every login. If your backend has `ATTENDANCE_DEVICE_BINDING_ENABLED=true`,
the first web login for each admin/manager account will need approval
via `PATCH /admin/devices/{device}/approve` (or temporarily disable device
binding for web-only accounts).

## Project structure

```
src/
  api/            axios client, auth, and per-domain resource functions
  context/        AuthContext (login state, persisted to localStorage)
  routes/         ProtectedRoute (role-gated routing)
  layouts/        DashboardLayout (sidebar + topbar, role-aware nav)
  components/     StatCard, Badge, Modal, Table, Spinner, SearchInput
  pages/
    LoginPage.jsx
    admin/        AdminDashboard, Employees, Devices, Leaves, Attendance, Reports, Settings
    manager/      ManagerDashboard, TeamAttendance, Leaves, Regularizations
```
