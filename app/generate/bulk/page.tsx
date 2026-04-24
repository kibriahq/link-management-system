'use client';

import { useState } from 'react';
import { useLinks } from '@/lib/LinkContext';
import { BulkBatch } from '@/lib/types';

export default function BulkGeneratorPage() {
  const { bulkBatches, addBulkBatch } = useLinks();
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [domain, setDomain] = useState('link.engine.io');
  const [urlCount, setUrlCount] = useState(1000);
  const [slugPattern, setSlugPattern] = useState<'random' | 'sequential'>('random');
  const [destinationPattern, setDestinationPattern] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleGenerate = () => {
    const newBatch: BulkBatch = {
      id: Date.now().toString(),
      name: campaignName || `Batch_${Date.now()}`,
      linkCount: urlCount,
      createdAt: 'Just now',
      status: 'ready',
    };
    addBulkBatch(newBatch);
    alert(`Generated ${urlCount} URLs successfully!`);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const mockUsers = [
    { id: '1', name: 'Sarah Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf2mvT8fV60FixbsAMVKqa8CPH-_lnKwjD7wB-O-NuMRCd7xk36445KpTaMQeMdWzrqskF0ztNPz3lASHWuES5S1jtKZBKK5yZ96JQI71OtyNV-CkZom2fMAJgee02YCuZ5M1C3tNl99cWNGc4ZaRXhoUNt4R5QymAG84EAmmGwE0vh-9KLcP3G-POHHMKRlM7Fp_x_doazWsLEVHeQ_5PRLZlNWdlWPu6BZWCAz3muCLbPTxGtxcg3BO9G2BMlDZ28R1QqmRFRg4' },
    { id: '2', name: 'Marcus Thorne', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJfDaU2Xdg3CRPIYh29gVjr6V68syUVSHPUVZPl-jYn98gGMMDUUP-w7RwUHhghMcKNFRHxPUrXqbsOFnM0Lqovhyc13QH4NSLE99vwY9FyjezNTWy36e9YT-HJcWN_IlpS9WSt6Ag11-BaX1ydD-a_r3ZVcQeewro9ni9p_DagZlL5aqwekq96TOYfNsrPPbkRxoAMuj0FBRehwLIu1PNkCW4WWfKtT0_6hRvUMYbYtstEvDXQdmlGcA8rFhYVMfaFOTIICQwwLU' },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#0050cb] font-bold uppercase tracking-widest text-[10px]">Operations Center</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Bulk URL Generator</h1>
        <p className="text-slate-500 mt-2">Automate the creation of high-volume marketing and operational link batches.</p>
      </header>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${step >= 1 ? 'bg-[#0066ff] text-white shadow-[#0066ff]/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
              1
            </div>
            <span className={`text-xs font-bold uppercase ${step >= 1 ? 'text-[#0050cb]' : 'text-slate-400'}`}>General Settings</span>
          </div>
          <div className={`h-px flex-1 mx-4 mt-[-20px] ${step >= 2 ? 'bg-[#0066ff]' : 'bg-slate-200'}`}></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
              2
            </div>
            <span className={`text-xs font-bold uppercase ${step >= 2 ? 'text-[#0050cb]' : 'text-slate-400'}`}>Configuration</span>
          </div>
          <div className={`h-px flex-1 mx-4 mt-[-20px] ${step >= 3 ? 'bg-[#0066ff]' : 'bg-slate-200'}`}></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
              3
            </div>
            <span className={`text-xs font-bold uppercase ${step >= 3 ? 'text-[#0050cb]' : 'text-slate-400'}`}>Assignments</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="material-symbols-outlined text-[#0050cb]">settings_input_component</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Step 1: General Settings</h3>
                <p className="text-sm text-slate-500">Define the core identity for this bulk generation campaign.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Campaign Name</label>
                <input
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-base focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                  placeholder="e.g. Summer 2024 Newsletter"
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <p className="text-xs text-slate-400 italic">This name is for internal tracking and will not appear in the URL.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Domain / Subdomain</label>
                <select
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-base focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  <option>link.engine.io</option>
                  <option>go.marketing.net</option>
                  <option>secure.shortener.app</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-[#0066ff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Next Step
              </button>
            </div>
          </section>
        )}
        {step === 2 && (
          <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="material-symbols-outlined text-[#0050cb]">tune</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Step 2: Configuration</h3>
                <p className="text-sm text-slate-500">Set the parameters for link structure and generation volume.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Number of URLs to generate</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg font-mono text-base focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                    type="number"
                    value={urlCount}
                    onChange={(e) => setUrlCount(Number(e.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">MAX 50,000</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Slug Generation Pattern</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSlugPattern('random')}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all ${slugPattern === 'random'
                        ? 'bg-[#0050cb]/5 border-2 border-[#0050cb] text-[#0050cb]'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    RANDOM ALPHANUMERIC
                  </button>
                  <button
                    onClick={() => setSlugPattern('sequential')}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all ${slugPattern === 'sequential'
                        ? 'bg-[#0050cb]/5 border-2 border-[#0050cb] text-[#0050cb]'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    SEQUENTIAL
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Destination URL Pattern</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0050cb]/20 focus-within:border-[#0050cb] transition-all">
                    <div className="px-4 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-mono text-sm">https://yoursite.com/product/</div>
                    <input
                      className="flex-1 px-4 py-3 border-none focus:ring-0 text-[#0050cb] font-mono text-sm"
                      placeholder="{dynamic_id}"
                      type="text"
                      value={destinationPattern}
                      onChange={(e) => setDestinationPattern(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Use <code className="bg-slate-100 px-1 rounded text-[#0050cb]">{'{dynamic_id}'}</code> to insert a unique identifier from your CSV data mapping.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-[#0066ff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Next Step
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="material-symbols-outlined text-[#0050cb]">group_add</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900">Step 3: Assignments</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase">Optional</span>
                </div>
                <p className="text-sm text-slate-500">Restrict campaign management to specific team members.</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Assigned Team Members</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((userId) => {
                  const user = mockUsers.find((u) => u.id === userId);
                  if (!user) return null;
                  return (
                    <div key={userId} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                      <img className="w-5 h-5 rounded-full object-cover" src={user.avatar} alt="" />
                      <span className="text-xs font-bold text-[#0050cb]">{user.name}</span>
                      <button onClick={() => toggleUser(userId)} className="material-symbols-outlined text-sm text-[#0050cb] cursor-pointer">close</button>
                    </div>
                  );
                })}
                <button
                  onClick={() => {
                    const availableUser = mockUsers.find((u) => !selectedUsers.includes(u.id));
                    if (availableUser) toggleUser(availableUser.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-slate-300 rounded-full hover:border-[#0050cb] hover:bg-slate-50 transition-all text-slate-500 hover:text-[#0050cb]"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span className="text-xs font-bold">Add Member</span>
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                className="px-8 py-2 bg-[#0066ff] text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 shadow-xl shadow-[#0066ff]/20"
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                Generate and Export CSV
              </button>
            </div>
          </section>
        )}
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Bulk Batches</h4>
          <a className="text-sm font-bold text-[#0050cb] hover:underline" href="#">View all history</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulkBatches.map((batch) => (
            <div key={batch.id} className="bg-white p-4 border border-slate-100 rounded-lg flex items-center gap-4">
              <div className={`w-10 h-10 rounded flex items-center justify-center ${batch.status === 'completed' ? 'bg-teal-50' : 'bg-blue-50'
                }`}>
                <span className={`material-symbols-outlined ${batch.status === 'completed' ? 'text-teal-600' : 'text-blue-600'
                  }`}>
                  {batch.status === 'completed' ? 'check_circle' : 'cloud_download'}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate">{batch.name}</p>
                <p className="text-[10px] text-slate-400">{batch.linkCount.toLocaleString()} links - {batch.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}