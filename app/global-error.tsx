'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('SwiftSurge application error:', error.digest);
  }, [error.digest]);

  return <html lang="en"><body style={{ margin: 0, background: '#f4f7f6', color: '#183747', fontFamily: 'Arial, sans-serif' }}>
    <main style={{ boxSizing: 'border-box', minHeight: '100vh', display: 'grid', alignContent: 'center', justifyItems: 'center', padding: '32px 20px', textAlign: 'center' }}>
      <img src="/images/swiftsurge-logistics-logo-wide.svg" alt="SwiftSurge Logistics" style={{ width: 190, height: 76, objectFit: 'contain', marginBottom: 28, background: '#fff', borderRadius: 10 }} />
      <span style={{ color: '#078777', fontSize: 11, fontWeight: 700, letterSpacing: '.14em' }}>PAGE COULD NOT LOAD</span>
      <h1 style={{ maxWidth: 560, margin: '12px 0', fontSize: 'clamp(30px, 6vw, 48px)', lineHeight: 1.1 }}>Let’s get you back on track.</h1>
      <p style={{ maxWidth: 460, color: '#60747d', fontSize: 15, lineHeight: 1.7 }}>A temporary issue interrupted this page. Try again, or return to the homepage.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 14 }}>
        <button type="button" onClick={() => window.location.reload()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 19px', border: 0, borderRadius: 24, background: '#078777', color: '#fff', fontWeight: 700, cursor: 'pointer' }}><RefreshCw size={16} /> Reload page</button>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 19px', border: '1px solid #cbd9d6', borderRadius: 24, color: '#183747', fontWeight: 700, textDecoration: 'none' }}>Homepage</a>
      </div>
      <a href="mailto:contact@swiftsurge.example" style={{ marginTop: 22, color: '#078777', fontSize: 13 }}>Contact SwiftSurge support</a>
    </main>
  </body></html>;
}
