'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase-client';
import { LinkItem, InputLink, LinkContextType, BulkBatch, ActivityItem, User } from './types';

const LinkContext = createContext<LinkContextType | undefined>(undefined);

const getTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

function transformLink(record: unknown): LinkItem {
  const link = record as Record<string, unknown>;
  return {
    id: link.id as number,
    name: link.name as string | undefined,
    slug: link.slug as string,
    url: link.url as string | undefined,
    userId: link.user_id as string | undefined,
    createdAt: link.created_at as string,
    status: (link.status as 'active' | 'inactive' | 'expired') || 'active',
  };
}

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [bulkBatches, setBulkBatches] = useState<BulkBatch[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refetch = async () => {
    try {
      const [linksRes, batchesRes, activityRes, usersRes] = await Promise.all([
        supabase.from('links').select('*').order('created_at', { ascending: false }),
        supabase.from('bulk_batches').select('*').order('created_at', { ascending: false }),
        supabase.from('activity').select('*').order('time', { ascending: false }),
        supabase.from('users').select('*'),
      ]);

      if (linksRes.data) {
        setLinks(linksRes.data.map(transformLink));
      }

      if (batchesRes.data) {
        setBulkBatches(batchesRes.data.map(batch => ({
          id: batch.id.toString(),
          name: batch.name,
          linkCount: batch.link_count,
          createdAt: new Date(batch.created_at).toLocaleDateString(),
          status: batch.status,
        })));
      }

      if (activityRes.data) {
        setActivity(activityRes.data.map(item => ({
          id: item.id.toString(),
          linkSlug: item.link_slug,
          location: item.location,
          device: item.device,
          timeAgo: getTimeAgo(item.time),
          type: item.type,
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
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const [linksRes, activityRes, usersRes] = await Promise.all([
        supabase.from('links').select('*').order('created_at', { ascending: false }),
        supabase.from('logs').select('*').order('time', { ascending: false }),
        supabase.from('users').select('*'),
      ]);
      if (cancelled) return;

      if (linksRes.data) {
        setLinks(linksRes.data.map(transformLink));
      }
      if (activityRes.data) {
        setActivity(activityRes.data.map(item => ({
          id: item.id.toString(),
          linkSlug: item.link_slug,
          location: item.location,
          device: item.device,
          timeAgo: getTimeAgo(item.time),
          type: item.type,
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
    }
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
      type: item.type,
    }).select().single();

    if (error) {
      console.error('Error adding activity:', error);
      throw error;
    }

    if (data) {
      const newItem: ActivityItem = {
        id: data.id.toString(),
        linkSlug: data.link_slug,
        location: data.location,
        device: data.device,
        timeAgo: 'Just now',
        type: data.type,
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
        bulkBatches,
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