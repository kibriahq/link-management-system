'use client';

import { useState } from 'react';
import { useLinks } from '@/lib/LinkContext';

export default function ManagePage() {
  const { links, updateLink, deleteLink } = useLinks();
  const [filter, setFilter] = useState<'active' | 'inactive'>('active');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredLinks = links.filter((link) => 
    filter === 'active' ? link.status === 'active' : link.status !== 'active'
  );

  const handleEdit = (link: typeof links[0]) => {
    setEditingId(link.id);
    setEditValue(link.destinationUrl);
  };

  const handleSave = (id: string) => {
    updateLink(id, { destinationUrl: editValue });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteLink(id);
    }
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
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'active' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'inactive' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Inactive
              </button>
            </div>
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
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#00655c]">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +12% vs last month
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Scans</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">qr_code_scanner</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">{links.reduce((a, l) => a + l.scans, 0).toLocaleString()}</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#00655c]">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +24% vs last month
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. CTR</span>
            <span className="material-symbols-outlined text-[#0066ff] bg-blue-50 p-1 rounded">ads_click</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">4.2%</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">
            <span className="material-symbols-outlined text-sm">horizontal_rule</span>
            Steady performance
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Broken Links</span>
            <span className="material-symbols-outlined text-red-500 bg-red-50 p-1 rounded">warning</span>
          </div>
          <div className="font-mono text-2xl font-semibold text-slate-900">24</div>
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Filter by domain:</span>
            <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-900 cursor-pointer">
              <option>All Domains</option>
              <option>lnke.ng</option>
              <option>go.corp.io</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">Showing 1-{filteredLinks.length} of {links.length} links</span>
          <button className="bg-white border border-slate-200 py-1.5 px-4 rounded-xl text-sm font-semibold text-slate-900 flex items-center gap-2 hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {/* <th className="py-3 px-4 w-10">
                <input onChange={() => {}} className="rounded-sm border-slate-300 text-[#0050cb] focus:ring-[#0050cb]/20" type="checkbox" />
              </th> */}
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Short URL</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Current Destination</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Assigned User</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Total Scans</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Last Scanned</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLinks.map((link) => (
              <tr key={link.id} className={`hover:bg-slate-50 transition-colors ${link.status === 'inactive' || link.status === 'expired' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                {/* <td className="py-3 px-4">
                  <input className="rounded-sm border-slate-300 text-[#0050cb] focus:ring-[#0050cb]/20" type="checkbox" />
                </td> */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 group">
                    <span className="font-mono text-[#0050cb] font-semibold cursor-pointer">lnke.ng/{link.shortCode}</span>
                    <button className="material-symbols-outlined text-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">content_copy</button>
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
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(link.id)}
                        />
                        <button onClick={() => handleSave(link.id)} className="text-[#0050cb] text-sm font-semibold">Save</button>
                      </div>
                    ) : (
                      <>
                        <input
                          className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 w-full truncate pr-6 group-hover:text-slate-900"
                          readOnly
                          type="text"
                          value={link.destinationUrl}
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
                    {link.userAvatar ? (
                      <img alt="Avatar" className="w-6 h-6 rounded-full" src={link.userAvatar} />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {link.userName?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                    )}
                    <span className="text-sm text-slate-700">{link.userName || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-mono text-sm text-slate-900">{link.scans.toLocaleString()}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-500 whitespace-nowrap">{link.lastActivity}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleEdit(link)}
                      className="p-1.5 text-slate-400 hover:text-[#0050cb] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit URL"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}