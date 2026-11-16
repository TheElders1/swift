import type { Metadata } from 'next';
import Link from 'next/link';
import { Boxes, LayoutDashboard } from 'lucide-react';
import { CreateShipmentForm } from '@/components/admin/create-shipment-form';
import { LogoutButton } from '@/components/admin/logout-button';

export const metadata: Metadata = { title: 'Create shipment · Operations' };

export default function NewShipmentPage() {
  return <div className="admin-page">
    <aside className="admin-sidebar">
      <Link className="brand" href="/"><img className="brand-logo" src="/images/swiftsurge-logistics-logo-wide.svg" alt="SwiftSurge Logistics" /></Link>
      <div className="admin-nav-label">WORKSPACE</div>
      <Link className="admin-nav" href="/shipments"><LayoutDashboard />Overview</Link>
      <Link className="admin-nav active" href="/shipments"><Boxes />Shipments</Link>
      <div className="admin-sidebar-bottom"><strong>Operations workspace</strong><span>Create a shipment to start tracking its journey.</span><Link href="/" className="admin-back">← Return to website</Link></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div className="admin-breadcrumb">Workspace <span>/</span> New shipment</div><div className="admin-top-actions"><div className="admin-avatar">FR</div><span className="admin-user">SwiftSurge Ops<small>Administrator</small></span><LogoutButton /></div></header>
      <div className="admin-content admin-create-content"><CreateShipmentForm /></div>
    </main>
  </div>;
}
