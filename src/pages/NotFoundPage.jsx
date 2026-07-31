import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-extrabold text-primary-600">404</p>
      <p className="text-slate-500 mt-2 mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Dashboard</Link>
    </div>
  );
}
