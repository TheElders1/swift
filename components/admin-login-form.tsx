'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function AdminLoginForm({ accessDenied = false }: { accessDenied?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(accessDenied ? 'This account is not enabled for administrator access.' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setErrorMessage('Supabase is not configured for this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy.');
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        const message = signInError.message.toLowerCase();
        if (message.includes('email not confirmed')) {
          setErrorMessage('Confirm this email address in Supabase Authentication, then try again.');
        } else {
          setErrorMessage('Supabase rejected this email and password. Check the Auth user and password in Supabase.');
        }
        return;
      }

      const { data: isAdmin, error: accessError } = await supabase.rpc('is_admin');
      if (accessError) {
        await supabase.auth.signOut();
        setErrorMessage('Could not check admin access. Run supabase/schema.sql in the Supabase SQL Editor, then retry.');
        return;
      }
      if (!isAdmin) {
        await supabase.auth.signOut();
        setErrorMessage('This account is signed in but is not allow-listed. Add its Auth user ID to public.admin_users.');
        return;
      }

      router.replace('/shipments');
      router.refresh();
    } catch (error) {
      console.error('Supabase admin sign-in request failed.', error);
      setErrorMessage('Could not reach Supabase. Check the Vercel project URL and publishable key, then redeploy.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Admin email address</label>
      <input
        type="email"
        id="email"
        placeholder="user@example.com"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}
      <button className="button button-green" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <>Signing in <LoaderCircle size={17} className="login-spinner" /></> : <>Sign in <ArrowRight size={17} /></>}
      </button>
    </form>
  );
}
