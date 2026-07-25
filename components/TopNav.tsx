'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSidebar } from '@/lib/SidebarContext';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toggle } = useSidebar();
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 right-0 z-40 flex items-center justify-between px-4 lg:px-8 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md lg:w-[calc(100%-240px)] w-full">
      <div className="flex items-center gap-4">
        {/* Hamburger Button - visible only on mobile */}
        <button
          onClick={toggle}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative hidden sm:block group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
            placeholder="Search URLs, tags, or domains..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 lg:gap-6">
        <Link
          href="/manage/new"
          className="flex sm:flex bg-[#0066ff] text-white px-4 py-2 rounded-lg text-sm font-semibold items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create <span className="hidden sm:block">New URL</span>
        </Link>
        <div className="flex items-center gap-2 lg:gap-4 text-slate-500">
          <button className="hover:text-[#0050cb] transition-colors p-2">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link href="mailto:hello@kibria.dev" className="hover:text-[#0050cb] transition-colors p-2">
            <span className="material-symbols-outlined">help_outline</span>
          </Link>
          <div className="h-10 w-10 relative rounded-full border border-slate-200 group">
            <Image
              height={150}
              width={150}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
              src="/avatar.png"
            />

            <div className="absolute right-0 mt-0 bg-white shadow-lg rounded-lg py-2 flex-col z-50 text-left flex invisible group-hover:visible">
              <a href="/settings" className="text-sm text-slate-600 hover:text-[#0050cb] hover:bg-blue-50 flex items-center gap-2 py-2 px-4">
                <span style={{ fontSize: '20px' }} className="material-symbols-outlined text-sm">settings</span>
                Settings
              </a>
              <button onClick={() => signOut()} className="text-sm cursor-pointer text-slate-600 hover:text-red-500 hover:bg-red-50 flex items-center gap-2 py-2 px-4">
                <span style={{ fontSize: '20px' }} className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}