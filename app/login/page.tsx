'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../(auth)/layout';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: supabaseError } = await signIn(email, password);

      if (supabaseError) {
        setError(supabaseError.message);
        setIsLoading(false);
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="font-label-md text-slate-700 block mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-colors font-body-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="font-label-md text-slate-700">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-[#0050cb] font-semibold hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-colors font-body-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-sm">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-[#0050cb] focus:ring-[#0050cb]"
          />
          <label htmlFor="remember" className="text-sm text-slate-600 font-medium">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0050cb] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#0066ff] focus:outline-none focus:ring-2 focus:ring-[#0050cb] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          className="w-full border border-slate-200 bg-white text-slate-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.56 9.18c0-.71-.06-1.4-.19-2.08H9v3.92h4.7c-.2 1.07-.81 1.98-1.73 2.6v2.16h2.8c1.63-1.5 2.8-3.71 2.8-6.6z" fill="#4285F4"/>
            <path d="M9 17.5c2.43 0 4.47-.8 5.96-2.16l-2.8-2.16c-.81.54-1.85.86-3.16.86-2.43 0-4.48-1.64-5.21-3.84H.88v2.24C2.31 15.36 5.43 17.5 9 17.5z" fill="#34A853"/>
            <path d="M3.79 10.56c-.25-.74-.39-1.53-.39-2.31s.14-1.57.39-2.31V4.01H.88C.3 5.61 0 7.52 0 9.5s.3 3.89.88 5.49l2.91-2.24c-.25-.74.16-2.31-.01-2.19z" fill="#FBAB5E"/>
            <path d="M9 3.75c1.35 0 2.57.47 3.53 1.38l2.67-2.67C13.46.98 11.42 0 9 0S4.54.98 1.8 2.46l2.91 2.24C4.52 5.39 6.57 3.75 9 3.75z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button> */}
      </form>
    </AuthLayout>
  );
}