import React from 'react';

export default function Table({ columns, data, emptyMessage = 'No records found.', renderRow }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((c) => (
              <th key={c} className="th">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((row, i) => renderRow(row, i))}</tbody>
      </table>
    </div>
  );
}
