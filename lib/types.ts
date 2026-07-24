export interface LinkItem {
  id: number;
  name?: string;
  slug: string;
  url?: string;
  userId?: string;
  createdAt: string;
  lastChecked?: string | undefined;
  status?: 'active' | 'inactive' | 'broken';
  logs?: []
}

export type InputLink = {
  name: string | null,
  slug: string;
  url: string | null;
  userId: string | null;
}


export interface ActivityItem {
  id: string;
  links: LinkItem;
  location: string;
  device: string;
  createdAt: string
  linkSlug?: string
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}