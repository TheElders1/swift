import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin-login-form';

export const metadata: Metadata = { title: 'Admin sign in' };

export default async function Login({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const { access } = await searchParams;
  return (
    <main className="ss-login-page">
      <header className="ss-login-header">
        <Link className="ss-login-brand" href="/" aria-label="SwiftSurge home">
          <img src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics" />
        </Link>
        <Link className="ss-login-home" href="/"><ArrowLeft size={15} /> Back to website</Link>
      </header>
      <section className="ss-login-layout">
        <div className="ss-login-intro">
          <span className="ss-login-kicker"><Sparkles size={14} /> OPERATIONS PORTAL</span>
          <h1>Every shipment,<br /><em>in motion.</em></h1>
          <p>A focused workspace for shipment records, delivery updates, and customer documents.</p>
          <div className="ss-login-route" aria-label="Shipment route: collected, in transit, delivered">
            <div className="ss-login-route-line" />
            <div><i /><span>COLLECTED</span></div>
            <div><i /><span>IN TRANSIT</span></div>
            <div><i /><span>DELIVERED</span></div>
          </div>
          <div className="ss-login-assurance"><ShieldCheck size={16} /> Authorized administrator access</div>
        </div>
        <div className="ss-login-card">
          <div className="ss-login-card-mark"><PackageCheck size={21} /></div>
          <span className="eyebrow">ADMINISTRATOR SIGN IN</span>
          <h2>Welcome back.</h2>
          <p>Sign in to manage your shipments and tracking updates.</p>
          <AdminLoginForm accessDenied={access === 'admin-required'} />
          <div className="login-support">Need admin access? Contact your SwiftSurge representative.</div>
        </div>
      </section>
      <footer className="ss-login-footer"><span>SWIFTSURGE LOGISTICS</span><span>Move Faster. Deliver Further.</span></footer>
    </main>
  );
}
