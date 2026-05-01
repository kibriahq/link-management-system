'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase-client';
import { LinkItem, InputLink, LinkContextType, ActivityItem, User } from './types';
import { redirect } from 'next/navigation';

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
      user_id: link.userId,
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
        user_id: link.userId,
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

  const updateLink = async (id: number, updates: Partial<LinkItem>) => {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.userId !== undefined) updateData.user_id = updates.userId;

    const { error } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating link:', error);
      throw error;
    }

    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
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