'use client';

import { useEffect } from 'react';
import { RefreshCw, Home, Mail } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('SwiftSurge page error:', error.digest);
  }, [error.digest]);

  return <main className="app-error-page" role="alert">
    <img src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics" />
    <span className="eyebrow">PAGE COULD NOT LOAD</span>
    <h1>Let’s get you back on track.</h1>
    <p>A temporary issue interrupted this page. Try again, or return to the homepage.</p>
    <div className="app-error-actions">
      <button className="button button-green" type="button" onClick={() => reset()}><RefreshCw size={16} /> Try again</button>
      <a className="button button-outline-dark" href="/"><Home size={16} /> Homepage</a>
    </div>
    <a className="app-error-contact" href="mailto:contact@swiftsurge.example"><Mail size={14} /> Contact support</a>
  </main>;
}
