'use server';

import { createClient } from '@/lib/supabase-server';

export async function updatePassword(
  oldPassword: string,
  newPassword: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: oldPassword,
  });

  if (verifyError) {
    return { success: false, error: 'Old password is incorrect' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
