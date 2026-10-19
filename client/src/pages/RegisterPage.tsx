import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Store, ArrowRight, Loader2, Phone } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Merchant specific fields
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone: phone || undefined
      };

      if (role === 'MERCHANT') {
        payload.storeName = storeName;
        payload.description = description;
        payload.address = address;
      }

      const data = await apiRequest<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setAuth(data.user, data.token);

      if (role === 'MERCHANT') {
        navigate('/merchant');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
        <p className="text-xs text-gray-500">Join KoyeMart as a buyer or merchant partner</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {/* Role toggle */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'CUSTOMER'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I am a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('MERCHANT')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'MERCHANT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I am a Merchant
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0100"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Merchant Fields */}
          {role === 'MERCHANT' && (
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Store Onboarding Details
              </span>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store / Brand Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Apex Outdoor Goods"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Store className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers what you craft or sell..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Physical Business Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Market St, City, Country"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register as {role === 'MERCHANT' ? 'Merchant' : 'Customer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};
