'use client';

import { useMemo } from 'react';
import { useLinks } from '@/lib/LinkContext';
import agentToDevice from '@/utils/agentToDevice';
import getTimeAgo from '@/utils/getTimeAgo';

type CountItem = {
  name: string;
  count: number;
  percentage: number;
};

const getBrowser = (agent: string) => {
  const ua = String(agent || '').toLowerCase();

  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('opr/') || ua.includes('opera')) return 'Opera';
  if (ua.includes('chrome/') || ua.includes('crios/')) return 'Chrome';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  if (ua.includes('firefox/') || ua.includes('fxios/')) return 'Firefox';
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'Bot';

  return 'Other';
};

const asPercentage = (part: number, total: number) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};

const toCountItems = (counts: Record<string, number>, total: number, limit = 6): CountItem[] => {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      percentage: asPercentage(count, total),
    }));
};

const getGrowthLabel = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 'No activity';
  if (previous === 0) return '+100% vs 7d';

  const change = Math.round(((current - previous) / previous) * 100);
  return `${change >= 0 ? '+' : ''}${change}% vs 7d`;
};

export default function AnalyticsPage() {
  const { links, activity } = useLinks();

  const analytics = useMemo(() => {
    const totalLinks = links.length;
    const activeLinks = links.filter((link) => link.status === 'active').length;
    const totalEvents = activity.length;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const referenceTime = Math.max(
      ...activity.map((item) => new Date(item.createdAt).getTime()).filter((time) => !Number.isNaN(time)),
      0
    );
    const lastSevenDays = activity.filter((item) => referenceTime - new Date(item.createdAt).getTime() <= sevenDaysMs);
    const previousSevenDays = activity.filter((item) => {
      const age = referenceTime - new Date(item.createdAt).getTime();
      return age > sevenDaysMs && age <= sevenDaysMs * 2;
    });

    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};

    activity.forEach((item) => {
      const device = agentToDevice(item.device);
      const browser = getBrowser(item.device);
      const location = item.location || 'Unknown';
      const day = Number.isNaN(new Date(item.createdAt).getTime())
        ? 'Unknown'
        : new Date(item.createdAt).toISOString().slice(0, 10);

      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    const topLinks = [...links]
      .sort((a, b) => (b.logs?.length || 0) - (a.logs?.length || 0))
      .slice(0, 5)
      .map((link) => ({
        ...link,
        scans: link.logs?.length || 0,
        percentage: asPercentage(link.logs?.length || 0, Math.max(...links.map((item) => item.logs?.length || 0), 1)),
      }));

    const lastActivity = activity[0];
    const avgScansPerLink = totalLinks ? totalEvents / totalLinks : 0;
    const activeRate = asPercentage(activeLinks, totalLinks);
    const bestDay = Object.entries(dailyCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalLinks,
      activeLinks,
      activeRate,
      totalEvents,
      avgScansPerLink,
      lastSevenDays: lastSevenDays.length,
      previousSevenDays: previousSevenDays.length,
      topLinks,
      devices: toCountItems(deviceCounts, totalEvents, 4),
      browsers: toCountItems(browserCounts, totalEvents, 5),
      locations: toCountItems(locationCounts, totalEvents, 6),
      lastActivity,
      bestDay,
    };
  }, [activity, links]);

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-headline-sm text-slate-900 mb-1">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Live performance metrics from your links and scan logs.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Scans</span>
            <span className="text-xs font-bold text-[#00655c] px-2 py-0.5 bg-[#00655c]/10 rounded-full">
              {getGrowthLabel(analytics.lastSevenDays, analytics.previousSevenDays)}
            </span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{analytics.totalEvents.toLocaleString()}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">{analytics.lastSevenDays.toLocaleString()} in the last 7 days</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Links</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">link</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{analytics.activeLinks.toLocaleString()}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">{analytics.activeRate}% of {analytics.totalLinks.toLocaleString()} links</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. Scans / Link</span>
            <span className="material-symbols-outlined text-[#00655c] bg-[#00655c]/10 p-1 rounded">analytics</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{analytics.avgScansPerLink.toFixed(1)}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">Based on all recorded logs</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Last Activity</span>
            <span className="material-symbols-outlined text-slate-500 bg-slate-100 p-1 rounded">schedule</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{analytics.lastActivity ? getTimeAgo(analytics.lastActivity.createdAt) : '-'}</div>
          <div className="mt-2 text-xs font-bold text-slate-400 truncate">{analytics.lastActivity?.links?.slug ? `/${analytics.lastActivity.links.slug}` : 'No scans yet'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Top Performing Links</h2>
            <span className="text-xs font-semibold text-slate-400">{analytics.totalEvents.toLocaleString()} total scans</span>
          </div>
          <div className="space-y-4">
            {analytics.topLinks.length > 0 ? analytics.topLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 w-6">#{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4 items-center mb-1">
                    <span className="text-sm font-semibold text-slate-900">/{link.slug}</span>
                    <span className="text-sm font-mono text-slate-600">{link.scans.toLocaleString()} scans</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0066ff] h-full rounded-full" style={{ width: `${link.percentage}%` }} />
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-400">{link.url || 'No destination'}</div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No links available yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Traffic by Location</h2>
          <div className="space-y-4">
            {analytics.locations.length > 0 ? analytics.locations.map((location) => (
              <div key={location.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-700">{location.name}</span>
                    <span className="text-sm font-mono text-slate-500">{location.count.toLocaleString()} / {location.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00655c] h-full rounded-full" style={{ width: `${location.percentage}%` }} />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No location data recorded yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Device Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.devices.length > 0 ? analytics.devices.map((device) => (
              <div key={device.name} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-slate-600">
                    {device.name === 'mobile' ? 'smartphone' : device.name === 'tablet' ? 'tablet_mac' : device.name === 'bot' ? 'memory' : 'desktop_windows'}
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900">{device.percentage}%</div>
                <div className="text-xs text-slate-500 capitalize">{device.name}</div>
                <div className="mt-1 text-[11px] font-mono text-slate-400">{device.count.toLocaleString()}</div>
              </div>
            )) : (
              <p className="col-span-full text-sm text-slate-500">No device data recorded yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Browser Usage</h2>
            <span className="text-xs font-semibold text-slate-400">
              Best day: {analytics.bestDay ? `${analytics.bestDay[0]} (${analytics.bestDay[1]})` : '-'}
            </span>
          </div>
          <div className="space-y-4">
            {analytics.browsers.length > 0 ? analytics.browsers.map((browser) => (
              <div key={browser.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-700">{browser.name}</span>
                    <span className="text-sm font-mono text-slate-500">{browser.count.toLocaleString()} / {browser.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0050cb] h-full rounded-full" style={{ width: `${browser.percentage}%` }} />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No browser data recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
