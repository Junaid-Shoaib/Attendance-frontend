import React from 'react';

export default function Spinner({ full = true }) {
  const wrapClass = full ? 'flex items-center justify-center py-24' : 'flex items-center justify-center py-6';
  return (
    <div className={wrapClass}>
      <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}
