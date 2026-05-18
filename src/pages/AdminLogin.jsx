import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EMAIL, ADMIN_PASSWORD, generateToken } from '../utils/jwt';
import toast from 'react-hot-toast';
import { ArrowRight, LockKeyhole, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({ role: "admin", email: ADMIN_EMAIL });
      localStorage.setItem("admin_token", token);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } else {
      const message = 'Invalid email or password';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&q=80"
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-background/90 to-background"></div>
      </div>

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/85 shadow-2xl shadow-slate-200/70 backdrop-blur-xl border border-white">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:flex min-h-[580px] flex-col justify-between bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-slate-950/65"></div>
            </div>
            <div className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-300">
              <Shield size={14} /> Store Admin
            </div>
            <div className="relative z-10 max-w-md">
              <h1 className="font-display text-5xl font-black leading-tight tracking-tight">
                Manage the Luxe catalog in real time.
              </h1>
              <p className="mt-5 text-sm font-medium leading-6 text-slate-300">
                Add, remove, and monitor products from a dashboard styled with the same premium storefront language.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKeyhole size={28} />
              </div>
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-primary">Authorized access</p>
              <h2 className="font-display text-3xl font-black tracking-tight text-slate-900">Admin Login</h2>
              <p className="mt-2 text-sm font-medium text-freshmuted">Sign in to manage products and storefront availability.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-fresh bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-fresh bg-slate-50"
                  required
                />
              </div>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-primary w-full py-4">
                Login to Dashboard <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
