'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mode = pathname === '/login' ? 'login' : 'signup';

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0066ff] rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">link</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LinkEngine</h1>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Enterprise URL Admin</p>
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="font-headline-sm text-slate-900">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="font-body-sm text-slate-500 mt-1">
              {mode === 'login'
                ? 'Sign in to access your enterprise dashboard'
                : 'Get started with your enterprise dashboard'}
            </p>
          </div>

          {children}

          {/* Footer */}
          <p className="font-body-sm text-slate-500 text-center">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#0050cb] font-semibold hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-[#0050cb] font-semibold hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0050cb] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="relative z-10 text-white text-center space-y-6 max-w-[400px]">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl">link</span>
          </div>
          <h3 className="text-2xl font-semibold">
            Enterprise URL Management
          </h3>
          <p className="text-white/70 font-body-sm">
            Streamline your URL infrastructure with dynamic NFC and QR code routing, real-time analytics, and bulk generation tools.
          </p>
          
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-xs text-white/60">URLs managed</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-xs text-white/60">Scans tracked</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-xs text-white/60">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}