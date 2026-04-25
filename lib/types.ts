export interface LinkItem {
  id: number;
  name?: string;
  slug: string;
  url?: string;
  userId?: string;
  createdAt: string;
  status?: 'active' | 'inactive' | 'expired';
}

export type InputLink = {
  name: string | null,
  slug: string;
  url: string | null;
  userId: string | null;
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
  getSlugs: () => Promise<string[]>;
  getLinkBySlug: (slug: string) => Promise<LinkItem | null>
  addLink: (link: LinkItem) => Promise<void>;
  addBulkLinks: (links: InputLink[]) => Promise<void>;
  updateLink: (id: number, updates: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: number) => Promise<void>;
  bulkBatches: BulkBatch[];
  activity: ActivityItem[];
  addActivity: (activity: ActivityItem) => Promise<void>;
  users: User[];
  loading: boolean;
  refetch: () => Promise<void>;
}