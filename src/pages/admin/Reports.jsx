import React from 'react';
import ReportPanel from '../../components/ReportPanel';

export default function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate and export attendance or leave reports for an individual employee, selected employees, or everyone.
        </p>
      </div>
      <ReportPanel scope="admin" />
    </div>
  );
}
