import React from 'react';
import ReportPanel from '../../components/ReportPanel';

// Section 6: identical UI to the Admin report, but every request this
// panel makes goes through /manager/reports/* endpoints, which the
// backend restricts to Employee-role data only - a Manager can never see
// Admin or other Managers' attendance/leave records here, even by
// tampering with request params, because the scoping happens server-side.
export default function ManagerReports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Attendance and leave reports for your Employee-role team. Export as CSV or Excel.
        </p>
      </div>
      <ReportPanel scope="manager" />
    </div>
  );
}
