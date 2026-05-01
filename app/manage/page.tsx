'use client';

import { useMemo, useState } from 'react';
import { useLinks } from '@/lib/LinkContext';
import { useInfo } from '@/lib/InfoContext';
import copyToClipboard from '@/utils/copyToClipboard';

const getGrowthStats = (dates: string[], windowDays = 30) => {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const times = dates
    .map((date) => new Date(date).getTime())
    .filter((time) => !Number.isNaN(time));
  const referenceTime = Math.max(...times, 0);

  if (!referenceTime) {
    return {
      current: 0,
      previous: 0,
      label: 'No growth data',
      isPositive: true,
    };
  }

  const current = times.filter((time) => referenceTime - time <= windowMs).length;
  const previous = times.filter((time) => {
    const age = referenceTime - time;
    return age > windowMs && age <= windowMs * 2;
  }).length;

  if (previous === 0 && current === 0) {
    return {
      current,
      previous,
      label: 'No growth data',
      isPositive: true,
    };
  }

  if (previous === 0) {
    return {
      current,
      previous,
      label: '+100% vs last 30d',
      isPositive: true,
    };
  }

  const change = Math.round(((current - previous) / previous) * 100);

  return {
    current,
    previous,
    label: `${change >= 0 ? '+' : ''}${change}% vs last 30d`,
    isPositive: change >= 0,
  };
};

const toCsvCell = (value: unknown) => {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
};

export default function ManagePage() {
  const { links, updateLink, deleteLink, activity } = useLinks();
  const [filter, setFilter] = useState<'active' | 'broken'>('active');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { baseUrl } = useInfo();

  const ctr = links.length > 0 ? ((links.reduce((sum, link) => sum + (link.logs?.length || 0), 0) / links.length) * 100).toFixed(2) : '0.00';
  const linkGrowth = useMemo(() => getGrowthStats(links.map((link) => link.createdAt)), [links]);
  const clickGrowth = useMemo(() => getGrowthStats(activity.map((item) => item.createdAt)), [activity]);

  const filteredLinks = links.filter((link) =>
    filter === 'active' ? link.status === 'active' : link.status !== 'active'
  );

  const handleEdit = (link: typeof links[0]) => {
    setEditingId(link.id);
    setEditValue(link.url || '');
  };

  const handleSave = (slug: string) => {
    updateLink(slug, { url: editValue });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteLink(id);
    }
  };

  const handleExportCsv = () => {
    const headers = ['id', 'name', 'slug', 'short_url', 'destination', 'status', 'total_scans', 'created_at', 'user_id'];
    const rows = links.map((link) => [
      link.id,
      link.name || '',
      link.slug,
      `${baseUrl.replace(/\/$/, '')}/${link.slug}`,
      link.url || '',
      link.status || 'active',
      link.logs?.length || 0,
      link.createdAt,
      link.userId || '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `links-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-sm text-slate-900">URL Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage, track, and optimize your enterprise short links.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCsv} className="bg-white border border-slate-200 py-1.5 px-4 rounded-xl text-sm font-semibold text-slate-900 flex items-center gap-2 hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Links</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">link</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{links.length.toLocaleString()}</div>
          <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${linkGrowth.isPositive ? 'text-[#00655c]' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-sm">{linkGrowth.isPositive ? 'trending_up' : 'trending_down'}</span>
            {linkGrowth.label}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">link</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{activity.length.toLocaleString()}</div>
          <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${clickGrowth.isPositive ? 'text-[#00655c]' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-sm">{clickGrowth.isPositive ? 'trending_up' : 'trending_down'}</span>
            {clickGrowth.label}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. CTR</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">ads_click</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{ctr}%</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">
            <span className="material-symbols-outlined text-sm">horizontal_rule</span>
            {links.reduce((sum, link) => sum + (link.logs?.length || 0), 0)} total clicks
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Broken Links</span>
            <span className="material-symbols-outlined text-red-500 bg-red-50 p-1 rounded">warning</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{links.filter(link => link.status === 'broken').length}</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-red-500">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            Immediate action required
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="bg-white border border-slate-200 py-1.5 px-4 rounded-xl text-sm font-semibold text-slate-900 flex items-center gap-2 hover:bg-slate-50">
              Bulk Actions
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Filter by domain:</span>
            <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-900 cursor-pointer">
              <option>All Domains</option>
              <option>lnke.ng</option>
              <option>go.corp.io</option>
            </select>
          </div> */}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">Showing 1-{filteredLinks.length} of {links.length} links</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'active' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('broken')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'broken' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Broken
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-10">
                {/* <input onChange={() => {}} className="rounded-sm border-slate-300 text-[#0050cb] focus:ring-[#0050cb]/20" type="checkbox" /> */}
                <p className="py-3 px-4 text-sm font-semibold text-slate-600">Id</p>
              </th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Short URL</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Destination</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Total Scans</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLinks.map((link) => (
              <tr key={link.id} className={`hover:bg-slate-50 transition-colors ${link.status === 'inactive' || link.status === 'broken' ? 'opacity-70 grayscale-[0.3]' : ''}`}>

                <td className="py-3 px-4">
                  <p className="py-3 px-4 text-sm font-semibold text-slate-600">{link.id}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 group">
                    <span className="font-mono text-[#0050cb] font-semibold cursor-pointer">/{link.slug}</span>
                    <button onClick={() => copyToClipboard(link.slug, baseUrl)} className="material-symbols-outlined text-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">content_copy</button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="relative group">
                    {editingId === link.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="bg-white border border-slate-200 rounded px-2 py-1 text-sm w-full focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(link.slug)}
                        />
                        <button onClick={() => handleSave(link.slug)} className="text-[#0050cb] text-sm font-semibold">Save</button>
                      </div>
                    ) : (
                      <>
                        <input
                          className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 w-full truncate pr-6 group-hover:text-slate-900"
                          readOnly
                          type="text"
                          value={link.url || ''}
                        />
                        <button
                          onClick={() => handleEdit(link)}
                          className="material-symbols-outlined text-sm absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 opacity-0 group-hover:opacity-100"
                        >
                          edit
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 text-center">{link.name || '-'}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 text-center mx-auto">{link.logs?.length}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${link.status === 'active' ? 'bg-[#00655c]/10 text-[#00655c]' : link.status === 'broken' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'
                      }`}>{link.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-500 whitespace-nowrap">{new Date(link.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    {/* <button
                      onClick={() => handleEdit(link)}
                      className="p-1.5 text-slate-400 hover:text-[#0050cb] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit URL"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button> */}
                    <button className="p-1.5 text-slate-400 hover:text-[#0050cb] hover:bg-blue-50 rounded-lg transition-colors" title="Generate QR Code">
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete_outline</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-200">
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Page</span>
            <input disabled className="w-10 text-center py-1 border-slate-200 rounded-lg text-sm font-medium focus:ring-[#0050cb]/20 focus:border-[#0050cb]" type="text" value="1" />
            <span className="text-sm text-slate-500">of {Math.ceil(links.length / 10)}</span>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
        <div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl h-full">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
              Recent Edits
              <span className="text-xs font-normal text-slate-400 cursor-pointer hover:text-slate-600">Clear all</span>
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-800">Sarah Chen updated destination for <b>lnke.ng/v-launch</b></p>
                  <span className="text-[11px] text-slate-400">14 mins ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-800">New short URL created <b>lnke.ng/dev-portal</b></p>
                  <span className="text-[11px] text-slate-400">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
