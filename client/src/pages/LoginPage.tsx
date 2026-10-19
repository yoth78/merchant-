import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Store, ArrowRight, Loader2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setAuth(data.user, data.token);

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.user.role === 'MERCHANT') {
        navigate('/merchant');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'customer' | 'merchant' | 'admin') => {
    if (type === 'customer') {
      setEmail('alex.buyer@gmail.com');
      setPassword('Password123!');
    } else if (type === 'merchant') {
      setEmail('techzone@merchant.com');
      setPassword('Password123!');
    } else {
      setEmail('admin@marketplace.com');
      setPassword('Password123!');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-xs text-gray-500">Sign in to your KoyeMart customer or merchant account</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials helper */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
            One-Click Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleFillDemo('customer')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-semibold text-gray-700 border border-gray-200 transition"
            >
              Buyer
            </button>
            <button
              onClick={() => handleFillDemo('merchant')}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-[10px] font-semibold text-emerald-800 border border-emerald-200 transition"
            >
              Merchant
            </button>
            <button
              onClick={() => handleFillDemo('admin')}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-[10px] font-semibold text-purple-800 border border-purple-200 transition"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-bold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};
