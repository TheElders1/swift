import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, PackageCheck, ShieldCheck } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin-login-form';

export const metadata: Metadata = { title: 'Admin sign in' };

export default async function Login({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const { access } = await searchParams;
  return (
    <main className="login-page">
      <div className="login-art">
        <div className="login-art-glow" />
        <Link className="brand brand-light" href="/">
          <img className="brand-logo" src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics — Momentum behind every delivery." />
        </Link>
        <div className="login-art-copy">
          <span className="eyebrow eyebrow-green">SWIFTSURGE OPERATIONS</span>
          <h1>Your shipments.<br /><em>One clear view.</em></h1>
          <p>Manage shipment records, update tracking milestones, and prepare customer documents from one workspace.</p>
          <div className="login-visual">
            <div className="login-visual-line" />
            <div className="login-visual-node node-a"><span>COLLECTED</span><i /></div>
            <div className="login-visual-node node-b"><span>IN TRANSIT</span><i /></div>
            <div className="login-visual-node node-c"><span>DELIVERED</span><i /></div>
            <div className="login-visual-box"><PackageCheck /><span>TRACKING ID</span><small>Shipment updates</small></div>
          </div>
        </div>
        <div className="login-art-bottom"><ShieldCheck size={16} />Administrator access</div>
      </div>
      <div className="login-form-side">
        <div className="login-form-wrap">
          <Link href="/" className="login-back"><ArrowLeft size={16} />Back to SwiftSurge</Link>
          <span className="eyebrow">ADMINISTRATOR SIGN IN</span>
          <h2>Welcome to operations.</h2>
          <p>Sign in to add shipments and manage delivery updates.</p>
          <AdminLoginForm accessDenied={access === 'admin-required'} />
          <div className="login-support">Need admin access? <a href="mailto:contact@swiftsurge.example">Contact your SwiftSurge representative</a></div>
        </div>
      </div>
    </main>
  );
}
