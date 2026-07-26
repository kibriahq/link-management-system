'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/SidebarContext';
import { ChartLine, Layers2, LayoutDashboard, Link2, Settings, Telescope } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard  fill="currentColor" size={21} /> },
  { name: 'URL Management', href: '/manage', icon: <Link2 size={21} /> },
  { name: 'Bulk Generator', href: '/generate/bulk', icon: <Layers2 size={21} /> },
  { name: 'URL Logs', href: '/logs', icon: <Telescope size={21} /> },
  { name: 'Analytics', href: '/analytics', icon: <ChartLine size={21} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={21} /> },
];

const bottomNavItems = [
  { name: 'Support', href: 'mailto:hello@kibria.dev', icon: 'help' },
  { name: 'Documentation', href: '/docs', icon: 'description' },
];

interface IconProps {
  icon: string;
}

function Icon({ icon }: IconProps) {
  const icons: Record<string, string> = {
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    layers: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z',
    logs: 'M40-360v-240h60v80h80v-80h60v240h-60v-100h-80v100H40Zm300 0v-180h-60v-60h180v60h-60v180h-60Zm220 0v-180h-60v-60h180v60h-60v180h-60Zm160 0v-240h140q24 0 42 18t18 42v40q0 24-18 42t-42 18h-80v80h-60Zm60-140h80v-40h-80v40Z',
    monitoring: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    settings: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    help: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
    description: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  };

  return (
    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: 'FILL 0, wght 400, GRAD 0, opsz 24' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d={icons[icon] || icons.link} />
      </svg>
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-[240px] border-r border-slate-200 bg-slate-50 flex flex-col py-6 px-4 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0066ff] rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">link</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">LinkEngine</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Enterprise URL Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${isActive
                    ? 'text-[#0050cb] bg-blue-50 font-semibold border-r-2 border-[#0050cb]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {/* <span className="material-symbols">{item.icon}</span> */}
                {item.icon}
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200 space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors duration-150 rounded-lg"
            >
              <Icon icon={item.icon} />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}