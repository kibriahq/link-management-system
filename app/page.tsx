'use client';

import { useMemo } from 'react';
import { useInfo } from '@/lib/InfoContext';
import { useLinks } from '@/lib/LinkContext';
import copyToClipboard from '@/utils/copyToClipboard';
import Link from 'next/link';
import getTimeAgo from '@/utils/getTimeAgo';
import agentToDevice from '@/utils/agentToDevice';

const buildSparklinePath = (values: number[]) => {
  const width = 100;
  const height = 40;
  const padding = 4;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - padding - (value / max) * (height - padding * 2);
    return { x, y };
  });

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  return {
    line,
    area: `${line} L${width} ${height} L0 ${height} Z`,
  };
};

const getTrendLabel = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 'No activity';
  if (previous === 0) return '+100%';

  const change = Math.round(((current - previous) / previous) * 100);
  return `${change >= 0 ? '+' : ''}${change}%`;
};

export default function Dashboard() {
  const { baseUrl } = useInfo();
  const { links, topActiveLinks, activity } = useLinks();

  const topLinks = topActiveLinks(3);
  const activeUrls = links.filter((l) => l.status === 'active').length;
  const brokenLinks = links.filter(link => link.status === 'broken').length;
  const systemHealth = 99.9;
  const clicksTrend = useMemo(() => {
    const validTimes = activity
      .map((item) => new Date(item.createdAt).getTime())
      .filter((time) => !Number.isNaN(time));
    const referenceDate = new Date(Math.max(...validTimes, 0));
    const dayStart = new Date(referenceDate);
    dayStart.setHours(0, 0, 0, 0);

    const currentDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(dayStart);
      date.setDate(dayStart.getDate() - (6 - index));
      return date.toISOString().slice(0, 10);
    });

    const previousDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(dayStart);
      date.setDate(dayStart.getDate() - (13 - index));
      return date.toISOString().slice(0, 10);
    });

    const counts = activity.reduce<Record<string, number>>((acc, item) => {
      const date = new Date(item.createdAt);
      if (Number.isNaN(date.getTime())) return acc;

      const key = date.toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const currentValues = currentDays.map((day) => counts[day] || 0);
    const previousTotal = previousDays.reduce((sum, day) => sum + (counts[day] || 0), 0);
    const currentTotal = currentValues.reduce((sum, value) => sum + value, 0);
    const paths = buildSparklinePath(currentValues);

    return {
      ...paths,
      label: getTrendLabel(currentTotal, previousTotal),
      isPositive: currentTotal >= previousTotal,
    };
  }, [activity]);

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
              <span className="text-sm font-semibold text-slate-500">Total Clicks</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${clicksTrend.isPositive ? 'text-[#00655c] bg-[#00655c]/10' : 'text-red-500 bg-red-50'}`}>
                {clicksTrend.label}
              </span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">
              {activity.length}
            </div>
          </div>
          <div className="mt-4 h-12 w-full relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path className={clicksTrend.isPositive ? 'text-[#00655c]/5' : 'text-red-500/5'} d={clicksTrend.area} fill="currentColor" />
              <path className={clicksTrend.isPositive ? 'text-[#00655c]' : 'text-red-500'} d={clicksTrend.line} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">
              <span className="material-symbols-outlined text-sm">horizontal_rule</span>
              {links.length} total links
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-[#0050cb] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Broken Links</span>
              <span className="material-symbols-outlined text-red-500 bg-red-50 p-1 rounded text-sm">warning</span>
            </div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900">{brokenLinks.toLocaleString()}</div>
          </div>
          {brokenLinks > 0 ? (
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-red-500">
              <span className="material-symbols-outlined text-sm">priority_high</span>
              Immediate action required
            </div>
          ) : (
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm text-[#0050cb]">verified_user</span>
            All links are healthy
          </div>
          )}
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
                  {topLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 group">
                            <span className="text-sm font-semibold text-slate-900">/{link.slug}</span>
                            <button onClick={() => copyToClipboard(link.slug, baseUrl)} className="material-symbols-outlined text-slate-300 cursor-pointer text-sm opacity-0 group-hover:opacity-100">content_copy</button>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {link.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 group">
                          <span className="text-sm text-slate-600 truncate max-w-[200px]">{link.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold font-mono text-slate-900">{link.logs?.length}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${link.status === 'active' ? 'bg-[#00655c]/10 text-[#00655c]' : link.status === 'broken' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'
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

          <div className="bg-[#0066ff]/5 border border-[#0066ff]/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 bg-[#0066ff] rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-900">Optimization Tip</h3>
              <p className="text-sm text-slate-600 mt-1">Your support-bot link is receiving high traffic{/* from Germany*/}. Consider localizing the destination page for better conversion.</p>
            </div>
            <Link href="/logs" className="bg-[#0066ff] text-white py-2 px-4 rounded-xl text-sm font-semibold hover:opacity-90 w-full sm:w-auto">View Insight</Link>
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
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[#00655c]/10 text-[#00655c]`}>
                  <span className="material-symbols-outlined text-sm">ads_click</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-slate-900 truncate">/{item.links?.slug}</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{getTimeAgo(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="mt-2 text-[10px] font-mono bg-slate-50 p-1 px-2 rounded inline-block text-slate-400">
                    {agentToDevice(item.device)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/logs" className="w-full py-4 text-center text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors border-t border-slate-100">
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
}
