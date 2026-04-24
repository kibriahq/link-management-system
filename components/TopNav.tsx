'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSidebar } from '@/lib/SidebarContext';

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toggle } = useSidebar();

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
          className="hidden sm:flex bg-[#0066ff] text-white px-4 py-2 rounded-lg text-sm font-semibold items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create New URL
        </Link>
        <div className="flex items-center gap-2 lg:gap-4 text-slate-500">
          <button className="hover:text-[#0050cb] transition-colors p-2">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:text-[#0050cb] transition-colors p-2">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2NzYhXYCPNN9KF4645jdFTaWNG7eQJKhCRK1_UbEglki97wDGWJ9wDBn4NMYPFo9xFi2tC10Ayza9S8IVfNLG2K_c664autvsYENRPPszcMppC7jPnPANplsPGTF_V_QohobUmWqmfUtr03Cir7C9MWvuzkoXXFRmZZHvRm-78HgOiSEa_3qGsE2c4pvhTamovkBvpBWwsNTBCtLl48YrHSrueJomEu_-oeSljoSyPrHUinXWG83mWkvYlA6nQccyRb6PTkLRf78"
            />
          </div>
        </div>
      </div>
    </header>
  );
}