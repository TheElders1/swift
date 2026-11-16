'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { SwiftSurgeWordmark } from '@/components/swiftsurge-brand';

const links = [
  ['Services', '/services'],
  ['About', '/about'],
  ['Network', '/locations'],
  ['Why SwiftSurge', '/why-us'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="ss-utility-bar">
        <div className="ss-container ss-utility-inner">
          <span><i /> Freight, courier &amp; delivery built around your business</span>
          <Link href="/track">Track a shipment <ArrowUpRight size={13} /></Link>
        </div>
      </div>
      <header className="ss-site-header">
        <div className="ss-container ss-header-inner">
          <Link href="/" className="ss-home-brand" aria-label="SwiftSurge Logistics home" onClick={() => setOpen(false)}>
            <SwiftSurgeWordmark />
          </Link>
          <button className="ss-menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>
            {open ? <X /> : <Menu />}
          </button>
          <nav className={`ss-nav${open ? ' ss-nav-open' : ''}`} aria-label="Main navigation">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link className="ss-admin-link" href="/login" onClick={() => setOpen(false)}>Admin sign in</Link>
            <Link className="ss-nav-track" href="/track" onClick={() => setOpen(false)}>Track parcel <ArrowDownRight size={15} /></Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="ss-footer">
      <div className="ss-footer-glow" aria-hidden="true" />
      <div className="ss-container ss-footer-main">
        <div className="ss-footer-lead">
          <Link href="/" aria-label="SwiftSurge Logistics home"><SwiftSurgeWordmark light /></Link>
          <p>Making every shipment easier to plan, follow, and deliver.</p>
          <Link className="ss-footer-track" href="/track">Follow a shipment <ArrowUpRight size={15} /></Link>
        </div>
        <div className="ss-footer-links">
          <div><span className="ss-footer-label">EXPLORE</span><Link href="/services">Services</Link><Link href="/about">About SwiftSurge</Link><Link href="/locations">Our network</Link><Link href="/why-us">Why SwiftSurge</Link></div>
          <div><span className="ss-footer-label">SHIPMENTS</span><Link href="/track">Track a shipment</Link><Link href="/login">Administrator sign in</Link><Link href="/about">About &amp; support</Link></div>
        </div>
        <div className="ss-footer-callout"><span className="ss-footer-label">LET’S GET MOVING</span><h2>One good move<br />starts here.</h2><Link href="/about">Talk to our team <ArrowUpRight size={16} /></Link></div>
      </div>
      <div className="ss-container ss-footer-bottom"><span>© {new Date().getFullYear()} SwiftSurge Logistics</span><span>Momentum behind every delivery.</span></div>
    </footer>
  );
}
