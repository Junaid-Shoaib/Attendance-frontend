import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'super_admin' && user.role !== 'manager') {
        toast.error('This portal is for Managers and Admins. Please use the mobile app.');
        setLoading(false);
        return;
      }
      const dest = location.state?.from?.pathname || (user.role === 'super_admin' ? '/admin' : '/manager');
      navigate(dest, { replace: true });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-4">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-ink">Admin & Manager Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Attendance Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              autoFocus
              className="input"
              placeholder="admin@attendance.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Sign In
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Employees should use the mobile app to mark attendance and manage leave.
        </p>
      </div>
    </div>
  );
}
