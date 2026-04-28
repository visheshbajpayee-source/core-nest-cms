'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAndStoreProfile, role } from '../service/login.service';

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Employee login attempt:', email);

      await loginAndStoreProfile({
        email,
        password,
      });

      if (role === 'employee') {
        router.replace('/employee1/dashboard');
      } else if (role === 'admin') {
        router.replace('/Admin/dashboard');
      } else if (role === 'manager') {
        router.replace('/manager/dashboard');
      } else {
        router.replace('/employee1/dashboard');
      }
    } catch (err: any) {
      setError(
        err.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employee Login
            </h1>

            <p className="text-gray-600 text-sm">
              Sign in to access your employee dashboard
            </p>
          </div>


          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 1.01-2.27 2.76-4.16 4.94-5.32M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m18 18l-3.1-3.1M9.88 9.88L6.1 6.1m7.78 7.78L17.9 17.9"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-sm text-gray-600">
                  Remember me
                </span>
              </label>

              <a
                href="#"
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Admin Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Admin?{' '}
            <Link
              href="/login"
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Login here
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link
              href="/signup/employee"
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}