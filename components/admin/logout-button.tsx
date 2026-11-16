'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function logout() {
    setBusy(true);
    setError('');
    const { error } = await createClient().auth.signOut();
    if (error) {
      setError('Could not sign out. Please try again.');
      setBusy(false);
      return;
    }
    router.replace('/login');
    router.refresh();
  }

  return <span className="admin-logout-wrap"><button type="button" className="admin-logout" onClick={logout} disabled={busy}>
    <LogOut size={15} />{busy ? 'Signing out…' : 'Sign out'}
  </button>{error && <span className="admin-logout-error" role="alert">{error}</span>}</span>;
}
