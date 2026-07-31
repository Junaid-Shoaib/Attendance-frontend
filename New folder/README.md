# Attendance Management System — Full Project Delivery

Three deliverables, all talking to the same Laravel 12 API:

| Folder / File | Description |
|---|---|
| `attendance-backend.zip` | Laravel 12 REST API (migrations, models, controllers, services, routes, seeders, views, tests) |
| `attendance-mobile-app.zip` | React Native mobile app for **Employees** (+ Admin/Manager on the go), including native `android/` and `ios/` source |
| `attendance-web-portal.zip` | **NEW** — React + Vite web dashboard for **Admins and Managers**, for desk-based use in a browser |
| `docs/schema.sql` | Standalone MySQL schema + seed data |
| `docs/openapi.yaml` | OpenAPI 3.0 spec for the full API (now includes `/admin/attendance`) |
| `docs/postman_collection.json` | Postman collection covering every endpoint |

## Why a separate web portal

Employees mark attendance via GPS/geofencing, which only makes sense on a
phone — so the mobile app remains their primary interface. Admins and
managers, though, mostly do desk work (approving leave, managing
employees, generating reports), which is a better fit for a browser. The
web portal covers that: same backend, same roles, different device. The
mobile app still includes full Admin/Manager screens too, so either role
can use whichever is convenient.

## Quick start

1. **Backend**: unzip `attendance-backend.zip` → `composer install` → `.env`
   → `php artisan migrate --seed` → `php artisan serve`.
2. **Web portal** (Admin/Manager): unzip `attendance-web-portal.zip` →
   `npm install` → set `VITE_API_BASE_URL` in `.env` → `npm run dev` →
   open `http://localhost:5173` and log in with `admin@attendance.app` /
   `manager@attendance.app` (password `Password@123`).
3. **Mobile app** (Employee, or Admin/Manager on the go): unzip
   `attendance-mobile-app.zip` → `npm install` → point `API_BASE_URL` at
   your backend → `npm run android` / `npm run ios`.
4. **API testing**: import `docs/postman_collection.json` into Postman, or
   open `docs/openapi.yaml` in Swagger UI / Redoc.

## Web portal contents

- **Admin**: company dashboard, employee CRUD, device approval queue,
  company-wide leave requests, company-wide daily attendance, CSV-exportable
  reports, settings (departments/designations/office geofence
  locations/holidays)
- **Manager**: team dashboard, team attendance, leave approvals,
  attendance-correction approvals

## Bug fix in this revision

The admin's company-wide attendance view previously reused the manager's
`/manager/team-attendance` endpoint, which filters by the *requesting
user's own direct reports* — for an admin with no direct reports, that
returned nothing. Added a dedicated `GET /admin/attendance` endpoint
(`AttendanceController::companyAttendance`) that returns attendance for
all employees on a given date, and pointed both the web portal and the
route table at it.

## Notes on running this in a sandboxed environment

This code was generated in an environment without access to
`packagist.org`, the npm registry has no restrictions, and there's no
ability to run native Android/iOS builds — so none of it has been
compiled or executed here. It follows Laravel 12 / React Native / React +
Vite conventions throughout, but do a normal QA pass before deploying:
run migrations against real MySQL, exercise endpoints via Postman, run
`npm run build` for the web portal, and build the mobile app on a real
device/emulator.
