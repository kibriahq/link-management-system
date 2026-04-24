'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LinkItem, LinkContextType, BulkBatch, ActivityItem, User } from './types';

const LinkContext = createContext<LinkContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: '1', name: 'Alex Rivers', role: 'Admin', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKRjL3zbQAV9bjbOsBxe3WNHN78GFT_onfY0lgqPxydDHwa-cXg4Vcz_u9dG7VmYLKREObPtPyssXxpBDh4EA-jHjfkry9MAf-8-UDmaAOhUk31KEk3VVDgrHJ5tVQHmFjs94_q7cur4CyEN8ozufB2hHJEY06-2_5CyD0wxa16ZOZys3lzNdGhd-heTn4pfkSpnL26OMPwZsBaVxMZceTygONcLljS-HD39EDZag_2XH7k_KDqWBFB-w6PNcpl2HwmGdy59yUVk' },
  { id: '2', name: 'Sarah Chen', role: 'Manager', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZ2O_ICU5U2mSHP0jlta02h-RfYWP79wPj70QVMUusYsYD_wHY9ozRypUnYh_MvLnXLPR0Vip3kIGutwDnVum4XaJ6oN3sslN0-vfqqvDRqABFpFIkKa0ll_8eiLY7-rvMI5fvSJyedztcZuMvD716osFNEAAu62SdgR9-ryK_nvcNZ2d0UJnvxvs5amFSO-LwKwicPRGq_MqEaXDCF846VWbHf5yq0FRvVn9a5T7j2wI-F5kYhE1MiytWtXansjg04dAbLCB-Gg' },
  { id: '3', name: 'Marcus Reed', role: 'User', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDRAlqMJDiPpR6jqR2yTDqVR_NhrqdjS770hlPym7gdvt8IPTaFdaH5kh1h7u7X1m-gR2na3WmwZOdWDGwfJmLq7CQIN2S21ryXIQ6V7CxM-Cmr6F_TpgvW2qBOj-ikcEo4GtU8lI_vSX4AQFm6FVyQ1H6VZv9V4rC_qvjIpjONDE7VHQT2WtcuSmyLyfx1nOqosfpHqYE8DDp5g0tISWyfYvkQo8dS3-dMMfd3t8TbWxB-XvHhGpZAfXKkm-I8AyVbSH9sMXm7sY' },
];

const initialLinks: LinkItem[] = [
  { id: '1', shortCode: 'summer-promo', destinationUrl: 'https://marketing.acme.com/campaigns/2024/summer', scans: 14208, createdAt: new Date().toISOString(), lastActivity: '2 mins ago', userId: '1', userName: 'Alex Rivers', userAvatar: initialUsers[0].avatar, status: 'active' },
  { id: '2', shortCode: 'v-launch', destinationUrl: 'https://product.acme.com/v-launch/documentation', scans: 8941, createdAt: new Date().toISOString(), lastActivity: '1 hour ago', userId: '2', userName: 'Sarah Chen', userAvatar: initialUsers[1].avatar, status: 'active' },
  { id: '3', shortCode: 'old-link', destinationUrl: 'https://archive.acme.com/legacy/deals', scans: 2105, createdAt: new Date().toISOString(), lastActivity: '3 weeks ago', userId: '3', userName: 'John Doe', status: 'expired' },
  { id: '4', shortCode: 'support-bot', destinationUrl: 'https://help.acme.com/chat/widget-v4-loader', scans: 42910, createdAt: new Date().toISOString(), lastActivity: 'Just now', userId: '3', userName: 'Marcus Reed', userAvatar: initialUsers[2].avatar, status: 'active' },
];

const initialActivity: ActivityItem[] = [
  { id: '1', linkSlug: 'summer-promo', location: 'New York, USA', device: 'iPhone 15 - Safari', timeAgo: 'Just Now', type: 'scan' },
  { id: '2', linkSlug: 'promo-discount-50', location: 'London, UK', device: 'Windows 11 - Chrome', timeAgo: '2m ago', type: 'click' },
  { id: '3', linkSlug: 'customer-support-qr', location: 'Berlin, DE', device: 'Android 14 - Firefox', timeAgo: '14m ago', type: 'scan' },
  { id: '4', linkSlug: 'summer-promo', location: 'Tokyo, JP', device: 'MacBook Pro - Safari', timeAgo: '22m ago', type: 'scan' },
];

const initialBatches: BulkBatch[] = [
  { id: '1', name: 'Newsletter_Oct_Final', linkCount: 12500, createdAt: '2h ago', status: 'completed' },
  { id: '2', name: 'SMS_Promo_V3', linkCount: 5000, createdAt: '5h ago', status: 'completed' },
  { id: '3', name: 'Referral_Bounty_Batch', linkCount: 8000, createdAt: 'Ready for download', status: 'ready' },
];

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [bulkBatches, setBulkBatches] = useState<BulkBatch[]>(initialBatches);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [users] = useState<User[]>(initialUsers);

  const addLink = (link: LinkItem) => {
    setLinks((prev) => [link, ...prev]);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const incrementScan = (id: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, scans: link.scans + 1, lastActivity: 'Just now' }
          : link
      )
    );
  };

  const addBulkBatch = (batch: BulkBatch) => {
    setBulkBatches((prev) => [batch, ...prev]);
  };

  const addActivity = (item: ActivityItem) => {
    setActivity((prev) => [item, ...prev]);
  };

  return (
    <LinkContext.Provider
      value={{
        links,
        addLink,
        updateLink,
        deleteLink,
        incrementScan,
        bulkBatches,
        addBulkBatch,
        activity,
        addActivity,
        users,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinkProvider');
  }
  return context;
}