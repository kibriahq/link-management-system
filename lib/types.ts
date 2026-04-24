export interface LinkItem {
  id: string;
  shortCode: string;
  destinationUrl: string;
  scans: number;
  createdAt: string;
  lastActivity: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface BulkBatch {
  id: string;
  name: string;
  linkCount: number;
  createdAt: string;
  status: 'completed' | 'ready' | 'processing';
}

export interface ActivityItem {
  id: string;
  linkSlug: string;
  location: string;
  device: string;
  timeAgo: string;
  type: 'scan' | 'click' | 'edit';
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface LinkContextType {
  links: LinkItem[];
  addLink: (link: LinkItem) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  incrementScan: (id: string) => void;
  bulkBatches: BulkBatch[];
  addBulkBatch: (batch: BulkBatch) => void;
  activity: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
  users: User[];
}