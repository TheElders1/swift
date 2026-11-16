import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) redirect('/login?access=admin-required');

  return children;
}
