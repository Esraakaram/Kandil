'use client';

import React, { useState } from 'react';
import { useNavigate } from '@/lib/navigation';
import { Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { api } from '@/services/api';

export const DashboardLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(username, password);
      localStorage.setItem('kandil_admin_token', res.token);
      localStorage.setItem('kandil_admin_user', JSON.stringify(res.user || { username, role: 'SuperAdmin' }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            لوحة تحكم قنديل العقارية
          </h1>
          <p className="text-gray-500 text-xs">
            سجل الدخول لإدارة المشروعات، الوحدات، ورسائل العملاء
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3.5 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <span className="text-[11px] text-gray-400 block">
              بيانات الدخول التجريبية: المستخدم <strong>admin</strong> | كلمة المرور <strong>admin</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardLogin;
