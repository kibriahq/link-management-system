'use client';

import { useMemo, useState } from 'react';
import { useInfo } from '@/lib/InfoContext';
import { useLinks } from '@/lib/LinkContext';
import agentToDevice from '@/utils/agentToDevice';
import copyToClipboard from '@/utils/copyToClipboard';
import getTimeAgo from '@/utils/getTimeAgo';
import {
  Bot,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  MapPin,
  Monitor,
  MonitorSmartphone,
  MousePointerClick,
  Radar,
  Search,
  Smartphone,
  Tablet,
  type LucideIcon,
} from 'lucide-react';

type DeviceFilter = 'all' | 'mobile' | 'desktop' | 'tablet' | 'bot';

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const deviceIcons: Record<Exclude<DeviceFilter, 'all'>, LucideIcon> = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
  bot: Bot,
};

export default function LogsPage() {
  const { activity, loading } = useLinks();
  const { baseUrl } = useInfo();
  const [query, setQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();

  const deviceCounts = useMemo(() => {
    return activity.reduce(
      (counts, item) => {
        const device = agentToDevice(item.device) as DeviceFilter;
        if (device !== 'all') {
          counts[device] += 1;
        }
        return counts;
      },
      { mobile: 0, desktop: 0, tablet: 0, bot: 0 }
    );
  }, [activity]);

  const topLocations = useMemo(() => {
    const counts = activity.reduce<Record<string, number>>((acc, item) => {
      const location = item.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [activity]);

  const filteredActivity = useMemo(() => {
    return activity.filter((item) => {
      const device = agentToDevice(item.device);
      const slug = item.links?.slug || '';
      const destination = item.links?.url || '';
      const location = item.location || '';
      const name = item.links?.name || '';

      const matchesDevice = deviceFilter === 'all' || device === deviceFilter;
      const matchesQuery =
        !normalizedQuery ||
        slug.toLowerCase().includes(normalizedQuery) ||
        destination.toLowerCase().includes(normalizedQuery) ||
        location.toLowerCase().includes(normalizedQuery) ||
        name.toLowerCase().includes(normalizedQuery);

      return matchesDevice && matchesQuery;
    });
  }, [activity, deviceFilter, normalizedQuery]);

  const latestActivity = activity[0];
  const uniqueLinks = new Set(activity.map((item) => item.links?.slug).filter(Boolean)).size;
  const mostUsedDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-headline-sm text-slate-900">URL Logs</h1>
            <p className="text-slate-500 text-sm mt-1">Real scan and tap events loaded from the logs table.</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20"
              placeholder="Search slug, URL, or location"
              type="search"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Events</span>
            <MousePointerClick className="h-8 w-8 rounded bg-blue-50 p-1 text-[#0066ff]" aria-hidden="true" />
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{activity.length.toLocaleString()}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">{filteredActivity.length.toLocaleString()} shown</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tracked URLs</span>
            <Link2 className="h-8 w-8 rounded bg-[#00655c]/10 p-1 text-[#00655c]" aria-hidden="true" />
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{uniqueLinks.toLocaleString()}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">With recorded activity</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Latest Event</span>
            <Clock3 className="h-8 w-8 rounded bg-blue-50 p-1 text-[#0050cb]" aria-hidden="true" />
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{latestActivity ? getTimeAgo(latestActivity.createdAt) : '-'}</div>
          <div className="mt-2 text-xs font-bold text-slate-400 truncate">{latestActivity?.links?.slug ? `/${latestActivity.links.slug}` : 'No activity yet'}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top Device</span>
            <MonitorSmartphone className="h-8 w-8 rounded bg-slate-100 p-1 text-slate-500" aria-hidden="true" />
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900 capitalize">{mostUsedDevice?.[1] ? mostUsedDevice[0] : '-'}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">{mostUsedDevice?.[1] || 0} events</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Activity Feed</h2>
              <p className="text-xs text-slate-500 mt-1">Showing {filteredActivity.length.toLocaleString()} of {activity.length.toLocaleString()} log events</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'mobile', 'desktop', 'tablet', 'bot'] as DeviceFilter[]).map((device) => (
                <button
                  key={device}
                  onClick={() => setDeviceFilter(device)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${deviceFilter === device
                      ? 'bg-[#0050cb] text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
                >
                  {device}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Event</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Short URL</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Destination</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Location</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Device</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Time</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivity.map((item) => {
                  const device = agentToDevice(item.device);
                  const slug = item.links?.slug || 'unknown';
                  const DeviceIcon = deviceIcons[device as Exclude<DeviceFilter, 'all'>] || Monitor;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-lg bg-[#00655c]/10 text-[#00655c] flex items-center justify-center">
                            <MousePointerClick className="h-[18px] w-[18px]" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="font-mono text-sm font-semibold text-slate-900">#{item.id}</div>
                            <div className="text-xs text-slate-400">{getTimeAgo(item.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 group">
                          <span className="font-mono text-sm font-semibold text-[#0050cb]">/{slug}</span>
                          {item.links?.slug && (
                            <button
                              onClick={() => copyToClipboard(item.links.slug, baseUrl)}
                              className="text-slate-400 sm:opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                              title="Copy short URL"
                            >
                              <Copy className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">{item.links?.name || 'Unnamed link'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-[260px] truncate text-sm text-slate-600">{item.links?.url || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          {/* <span className="material-symbols-outlined text-sm text-slate-400">location_on</span> */}
                          <MapPin className="h-5 w-5 text-slate-400" aria-hidden="true" />
                          <span>{item.location || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                          <DeviceIcon className="h-4 w-4" aria-hidden="true" />
                          {device}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-600 whitespace-nowrap">{formatDateTime(item.createdAt)}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.links?.url ? (
                          <a
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            href={item.links.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Open
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No URL</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && filteredActivity.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Radar className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No logs found</h3>
              <p className="mt-1 text-sm text-slate-500">Try changing the search text or device filter.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Device Mix</h2>
            <div className="space-y-4">
              {Object.entries(deviceCounts).map(([device, count]) => {
                const percentage = activity.length ? Math.round((count / activity.length) * 100) : 0;

                return (
                  <div key={device}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold capitalize text-slate-700">{device}</span>
                      <span className="font-mono text-sm text-slate-500">{percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#0066ff]" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Top Locations</h2>
            <div className="space-y-3">
              {topLocations.length > 0 ? topLocations.map(([location, count]) => (
                <div key={location} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-slate-700">{location}</span>
                  <span className="font-mono text-sm font-semibold text-slate-900">{count}</span>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No location data recorded yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
