'use server';

import { createClient } from '@/lib/supabase-server';

export async function updateUserProfile(
  name: string,
  default_redirect: string,
  email?: string
) {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const updates: Record<string, string> = { name, default_redirect };

  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) {
      return { success: false, error: emailError.message };
    }
  }
  
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
