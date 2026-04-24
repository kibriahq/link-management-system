'use client';

import { useLinks } from '@/lib/LinkContext';
import Link from 'next/link';

export default function Dashboard() {
  const { links, activity } = useLinks();

  const totalScans = links.reduce((acc, link) => acc + link.scans, 0);
  const activeUrls = links.filter((l) => l.status === 'active').length;
  const registeredUsers = 8520;
  const systemHealth = 99.9;

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-headline-sm text-slate-900 mb-1">System Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of your enterprise URL infrastructure performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between group hover:border-[#0050cb] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-500">Total Scans</span>
              <span className="text-xs font-bold text-[#00655c] px-2 py-0.5 bg-[#00655c]/10 rounded-full">+12.4%</span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">
              {totalScans.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 h-12 w-full relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path className="text-[#00655c]" d="M0 35 Q10 25 20 30 T40 15 T60 25 T80 5 T100 20" fill="none" stroke="currentColor" strokeWidth="2" />
              <path className="text-[#00655c]/5" d="M0 35 Q10 25 20 30 T40 15 T60 25 T80 5 T100 20 V40 H0 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-[#0050cb] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-500">Active URLs</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">link</span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">{activeUrls.toLocaleString()}</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGm_kfSPH6_bfWkHz2gG1wKfkXL4lHBomRR3iEM88CZv9qiAxiGGvAP5Jr4ByfWATsHRwdyuevUeFly0TX1Ar54baeltnOBu8ATqJHRqxWFHcNaLQsdUpkIrvpq0BBI3i_5yRRflgDODAdA2ibE9-fip8zR8FAXeAg1MkPpuY8sVjQJzHDrTg-vC0N4pLwg7QX7WT9HJccUi07rK5JkwNqidSw55hDOgjnoxtbpQ_LvGBt1YiBxOycq_Yz1IFTYfRSCqz0D7JKu24" alt="" />
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWmq6poZfddu8331x39cjFniJi77ajv4L-oFJwWUJt1exJHuxH1UHdVfZnNpYQOONEj1i2s6ZI1YBTVc3wLqnZvJw-biXzbfHg2BuK3SLLitd9N1qrLIy-oO1NhEfEZ0RaGIQLn43_olFyq6pMma03FQ0gwPHLDf-yx2_EYDBFOS4oj8c9xd-hdYLkMtVn8w1DVaJbP5Z00XtKHVOBl08N02NWhBdPgV9df00oYFUvJ8kYUGa3jrA4nM4StZr1QKq5-HadJIfCMD4" alt="" />
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold">+12</div>
            </div>
            <span className="text-xs text-slate-400">newly registered today</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-[#0050cb] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-500">Registered Users</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">group</span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">{registeredUsers.toLocaleString()}</div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm text-[#0050cb]">verified_user</span>
            98.2% verified accounts
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-[#0050cb] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-500">System Health</span>
              <span className="material-symbols-outlined text-[#00655c] text-sm">check_circle</span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">{systemHealth}%</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00655c] h-full w-[99.9%]"></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">Uptime (30d)</span>
              <span className="text-[10px] font-bold text-[#00655c]">Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Top Performing URLs</h2>
              <Link href="/manage" className="text-[#0050cb] text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase">Slug / Identifier</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase">Destination</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase">Scans</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {links.slice(0, 3).map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">/{link.shortCode}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {link.id.padStart(4, '0')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 group">
                          <span className="text-sm text-slate-600 truncate max-w-[200px]">{link.destinationUrl}</span>
                          <button className="material-symbols-outlined text-slate-300 group-hover:text-[#0050cb] cursor-pointer text-sm">content_copy</button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold font-mono text-slate-900">{link.scans.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                          link.status === 'active' ? 'bg-[#00655c]/10 text-[#00655c]' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {link.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#0066ff]/5 border border-[#0066ff]/20 p-6 rounded-2xl flex items-center gap-6">
            <div className="w-12 h-12 bg-[#0066ff] rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">Optimization Tip</h3>
              <p className="text-sm text-slate-600 mt-1">Your support-bot link is receiving high traffic from Germany. Consider localizing the destination page for better conversion.</p>
            </div>
            <button className="bg-[#0066ff] text-white py-2 px-4 rounded-xl text-sm font-semibold hover:opacity-90">View Insight</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Scan Activity</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activity.slice(0, 4).map((item, index) => (
              <div key={item.id} className="flex gap-4 relative pb-6">
                {index < activity.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-100"></div>}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  item.type === 'scan' ? 'bg-blue-100 text-[#0050cb]' : 
                  item.type === 'click' ? 'bg-[#00655c]/10 text-[#00655c]' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="material-symbols-outlined text-sm">{item.type === 'scan' ? 'qr_code_2' : 'ads_click'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-slate-900 truncate">/{item.linkSlug}</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="mt-2 text-[10px] font-mono bg-slate-50 p-1 px-2 rounded inline-block text-slate-400">
                    {item.device}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-center text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors border-t border-slate-100">
            View Historical Feed
          </button>
        </div>
      </div>
    </div>
  );
}