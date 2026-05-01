'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase-client';
import { LinkItem, InputLink, ActivityItem, User } from './types';
import { redirect } from 'next/navigation';
import { useAuth } from './AuthContext';
// import { revalidateTag } from "next/cache";

// export async function clearCache(slug: string) {
//   revalidateTag(`link-${slug}`, {
//     expire: 0, // immediately expire the cache
//   });
// }

const clearCache = async (slug: string) => {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  });
};

export interface LinkContextType {
  links: LinkItem[];
  getSlugs: () => Promise<string[]>;
  getLinkBySlug: (slug: string) => Promise<LinkItem | null>
  addLink: (link: LinkItem) => Promise<void>;
  addBulkLinks: (links: InputLink[]) => Promise<void>;
  updateLink: (slug: string, updates: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: number) => Promise<void>;
  activity: ActivityItem[];
  addActivity: (activity: ActivityItem) => Promise<void>;
  users: User[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

function transformLink(record: unknown): LinkItem {
  const link = record as Record<string, unknown>;
  return {
    id: link.id as number,
    name: link.name as string | undefined,
    slug: link.slug as string,
    url: link.url as string | undefined,
    userId: link.user_id as string | undefined,
    createdAt: link.created_at as string,
    logs: (link.logs as []) || [],
    status: (link.status as 'active' | 'inactive' | 'broken') || 'active',
  };
}

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  const refetch = async () => {
    try {
      const [linksRes, activityRes, usersRes] = await Promise.all([
        supabase.from('links').select(`*, logs!logs_link_id_fkey (*)`).order('id', { ascending: false }),
        supabase.from('logs').select(`*, links!logs_link_id_fkey (*)`).order('created_at', { ascending: false }),
        supabase.from('users').select('*'),
      ]);

      if (linksRes.data) {
        setLinks(linksRes.data.map(transformLink));
      }

      console.log(activityRes.data);

      if (activityRes.data) {
        setActivity(activityRes.data.map(item => ({
          id: item.id.toString(),
          links: item.links,
          location: item.location,
          device: item.user_agent,
          createdAt: item.created_at,
        })));
      }
      if (usersRes.data) {
        setUsers(usersRes.data.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar_url,
          role: user.role,
        })));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      await refetch();
      if (!cancelled) {
        setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const getSlugs = async (): Promise<string[]> => {
    const { data, error } = await supabase.from('links').select('slug');
    if (error) {
      console.error('Error fetching slugs:', error);
      return [];
    }

    return data ? (data as { slug: string }[]).map(item => item.slug) : [];
  };

  const getLinkBySlug = async (slug: string): Promise<LinkItem | null> => {
    const { data, error } = await supabase.from('links').select('*').eq('slug', slug).single();
    if (error) {
      console.error('Error fetching link by slug:', error);
      return null;
    }

    return data ? (data as LinkItem) : null;
  };

  const addLink = async (link: LinkItem) => {
    const { data, error } = await supabase.from('links').insert({
      name: link.name,
      slug: link.slug,
      url: link.url,
      user_id: user?.id || null,
      status: link.status || 'active',
    }).select().single();

    if (error) {
      console.error('Error adding link:', error);
      throw error;
    }

    if (data) {
      const newLink = transformLink(data);
      setLinks((prev) => [newLink, ...prev]);
    }
  };

  const addBulkLinks = async (links: InputLink[]) => {
    const { data, error } = await supabase.from('links').insert(
      links.map(link => ({
        name: link.name,
        slug: link.slug,
        url: link.url,
        user_id: user?.id || null,
      }))
    ).select();

    if (error) {
      console.error('Error adding bulk links:', error);
      throw error;
    }
    if (data) {
      const newLinks = data.map(transformLink);
      setLinks((prev) => [...newLinks, ...prev]);
    }

    redirect('/manage');
  };

  const updateLink = async (slug: string, updates: Partial<LinkItem>) => {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.userId !== undefined) updateData.user_id = updates.userId;

    const { error } = await supabase
      .from('links')
      .update(updateData)
      .eq('slug', slug);

    if (error) {
      console.error('Error updating link:', error);
      throw error;
    }
    


    clearCache(slug || '');
    // clearCache(updates.slug || '');

    setLinks((prev) =>
      prev.map((link) => (link.slug === slug ? { ...link, ...updates } : link))
    );
  };

  const deleteLink = async (id: number) => {
    const { error } = await supabase.from('links').delete().eq('id', id);

    if (error) {
      console.error('Error deleting link:', error);
      throw error;
    }

    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const addActivity = async (item: ActivityItem) => {
    const { data, error } = await supabase.from('activity').insert({
      link_slug: item.linkSlug,
      location: item.location,
      device: item.device,
    }).select().single();

    if (error) {
      console.error('Error adding activity:', error);
      throw error;
    }

    if (data) {
      const newItem: ActivityItem = {
        id: data.id.toString(),
        links: data.links,
        location: data.location,
        device: data.device,
        createdAt: data.created_at,
      };
      setActivity((prev) => [newItem, ...prev]);
    }
  };

  return (
    <LinkContext.Provider
      value={{
        links,
        getSlugs,
        getLinkBySlug,
        addLink,
        addBulkLinks,
        updateLink,
        deleteLink,
        activity,
        addActivity,
        users,
        loading,
        refetch,
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