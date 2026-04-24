'use client';

import { useLinks } from '@/lib/LinkContext';

export default function AnalyticsPage() {
  const { links } = useLinks();

  const totalScans = links.reduce((acc, link) => acc + link.scans, 0);
  const activeLinks = links.filter(l => l.status === 'active').length;

  const topLinks = [...links].sort((a, b) => b.scans - a.scans).slice(0, 5);

  const countries = [
    { name: 'United States', percentage: 42, scans: 538964 },
    { name: 'United Kingdom', percentage: 18, scans: 231210 },
    { name: 'Germany', percentage: 14, scans: 179830 },
    { name: 'France', percentage: 12, scans: 154140 },
    { name: 'Canada', percentage: 8, scans: 102760 },
    { name: 'Other', percentage: 6, scans: 77108 },
  ];

  const devices = [
    { name: 'Mobile', percentage: 58, icon: 'smartphone' },
    { name: 'Desktop', percentage: 32, icon: 'computer' },
    { name: 'Tablet', percentage: 10, icon: 'tablet' },
  ];

  const browsers = [
    { name: 'Chrome', percentage: 64 },
    { name: 'Safari', percentage: 22 },
    { name: 'Firefox', percentage: 8 },
    { name: 'Edge', percentage: 4 },
    { name: 'Other', percentage: 2 },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-headline-sm text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Track performance metrics and user engagement across all your links.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Scans</span>
            <span className="text-xs font-bold text-[#00655c] px-2 py-0.5 bg-[#00655c]/10 rounded-full">+12.4%</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{totalScans.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Links</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{activeLinks}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. CTR</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">4.2%</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">2.8%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Top Performing Links</h2>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 w-6">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-900">/{link.shortCode}</span>
                    <span className="text-sm font-mono text-slate-600">{link.scans.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0066ff] h-full rounded-full"
                      style={{ width: `${(link.scans / topLinks[0].scans) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Traffic by Country</h2>
          <div className="space-y-4">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-700">{country.name}</span>
                    <span className="text-sm font-mono text-slate-500">{country.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00655c] h-full rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Device Distribution</h2>
          <div className="flex justify-around items-center">
            {devices.map((device) => (
              <div key={device.name} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-slate-600">{device.icon}</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{device.percentage}%</div>
                <div className="text-xs text-slate-500">{device.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Browser Usage</h2>
          <div className="space-y-4">
            {browsers.map((browser) => (
              <div key={browser.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-700">{browser.name}</span>
                    <span className="text-sm font-mono text-slate-500">{browser.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0050cb] h-full rounded-full"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}