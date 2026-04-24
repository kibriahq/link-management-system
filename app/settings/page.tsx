'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'Acme Corporation',
    defaultDomain: 'link.engine.io',
    timezone: 'America/New_York',
    emailNotifications: true,
    slackNotifications: false,
    twoFactorAuth: true,
    apiAccess: true,
    defaultRedirect: 'https://example.com',
    qrCodeFormat: 'png',
    qrCodeSize: 300,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: 'settings' },
    { id: 'security', name: 'Security', icon: 'security' },
    { id: 'integrations', name: 'Integrations', icon: 'extension' },
    { id: 'api', name: 'API Keys', icon: 'key' },
    { id: 'billing', name: 'Billing', icon: 'credit_card' },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-headline-sm text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and application preferences.</p>
      </header>

      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-[#0050cb] border-r-2 border-[#0050cb]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Company Name</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Default Domain</label>
                  <select
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                    value={settings.defaultDomain}
                    onChange={(e) => setSettings({ ...settings, defaultDomain: e.target.value })}
                  >
                    <option>link.engine.io</option>
                    <option>go.marketing.net</option>
                    <option>secure.shortener.app</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Timezone</label>
                  <select
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Default Redirect URL</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                    type="text"
                    value={settings.defaultRedirect}
                    onChange={(e) => setSettings({ ...settings, defaultRedirect: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">QR Code Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Format</label>
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                      value={settings.qrCodeFormat}
                      onChange={(e) => setSettings({ ...settings, qrCodeFormat: e.target.value })}
                    >
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                      <option value="jpg">JPG</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Default Size (px)</label>
                    <input
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                      type="number"
                      value={settings.qrCodeSize}
                      onChange={(e) => setSettings({ ...settings, qrCodeSize: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button className="px-6 py-2 bg-[#0066ff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-[#0066ff]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">API Access</h3>
                    <p className="text-xs text-slate-500 mt-1">Allow API access to your account</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, apiAccess: !settings.apiAccess })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.apiAccess ? 'bg-[#0066ff]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      settings.apiAccess ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Current Password</label>
                    <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all" type="password" />
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">New Password</label>
                    <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Confirm New Password</label>
                    <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all" type="password" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button className="px-6 py-2 bg-[#0066ff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Email Notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-[#0066ff]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Slack Notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">Get notified in your Slack workspace</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, slackNotifications: !settings.slackNotifications })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.slackNotifications ? 'bg-[#0066ff]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      settings.slackNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Slack', 'Zapier', 'Google Analytics', 'Salesforce', 'HubSpot', 'Mailchimp'].map((integration) => (
                  <div key={integration} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#0050cb] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">link</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{integration}</span>
                    </div>
                    <button className="text-xs font-semibold text-[#0050cb] hover:underline">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">Production API Key</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-600">
                    sk_live_****************************1234
                  </code>
                  <button className="p-2 text-slate-500 hover:text-[#0050cb] hover:bg-blue-50 rounded transition-colors">
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                  <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <span className="material-symbols-outlined text-sm">delete_outline</span>
                  </button>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-semibold text-slate-500 hover:border-[#0050cb] hover:text-[#0050cb] transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add</span>
                Generate New API Key
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Billing & Subscription</h2>
              
              <div className="p-6 bg-gradient-to-r from-[#0066ff] to-[#0050cb] rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Current Plan</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-bold">Enterprise</span>
                </div>
                <div className="text-3xl font-bold mb-1">Unlimited</div>
                <p className="text-sm opacity-80">100,000 URLs included</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Next billing date</h3>
                    <p className="text-xs text-slate-500 mt-1">May 15, 2024</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">$299/month</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Payment method</h3>
                    <p className="text-xs text-slate-500 mt-1">Visa ending in 4242</p>
                  </div>
                  <button className="text-xs font-semibold text-[#0050cb] hover:underline">Update</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}