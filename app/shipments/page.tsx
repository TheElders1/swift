import type { Metadata } from 'next';
import Link from 'next/link';
import { Boxes, FileText, LayoutDashboard, MapPinned, Plus, Trash2, Users } from 'lucide-react';
import { LogoutButton } from '@/components/admin/logout-button';
import { ShipmentActionsMenu } from '@/components/admin/shipment-actions-menu';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = { title: 'Shipments · Operations' };
const statusLabels: Record<string, string> = { pending: 'Pending 📋', collected: 'Collected 📦', in_transit: 'In transit 🚚', out_for_delivery: 'Out for delivery 🛵', delivered: 'Delivered ✅', delayed: 'Delayed ⚠️', cancelled: 'Cancelled' };

export default async function ShipmentsDashboard() {
  const supabase = await createClient();
  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('id,tracking_number,sender_name,receiver_name,origin,destination,status,estimated_delivery,created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return <div className="admin-page">
    <aside className="admin-sidebar">
      <Link className="brand" href="/"><img className="brand-logo" src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics" /></Link>
      <div className="admin-nav-label">WORKSPACE</div>
      <Link className="admin-nav active" href="/shipments"><LayoutDashboard />Overview</Link>
      <Link className="admin-nav active" href="/shipments"><Boxes />Shipments</Link>
      <Link className="admin-nav" href="/shipments"><MapPinned />Tracking history</Link>
      <Link className="admin-nav" href="/shipments"><Users />Customers</Link>
      <div className="admin-nav-label admin-nav-label-lower">MANAGE</div>
      <Link className="admin-nav" href="/shipments"><FileText />Documents</Link>
      <div className="admin-sidebar-bottom">
        <strong>Operations workspace</strong>
        <span>Shipment records and delivery updates will appear here.</span>
        <Link href="/" className="admin-back">← Return to website</Link>
      </div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar">
        <div className="admin-breadcrumb">Workspace <span>/</span> Shipments</div>
        <div className="admin-top-actions"><div className="admin-avatar">FR</div><span className="admin-user">SwiftSurge Ops<small>Administrator</small></span><LogoutButton /></div>
      </header>
      <div className="admin-content">
        <div className="admin-heading">
          <div><span className="eyebrow">OPERATIONS</span><h1>Shipments</h1><p>Your shipment workspace is ready.</p></div>
          <div className="admin-heading-actions"><Link className="button button-outline-dark" href="/shipments/trash"><Trash2 size={16}/> Trash</Link><Link className="button button-green" href="/shipments/new"><Plus size={17} /> Create shipment</Link></div>
        </div>
        {error ? <section className="admin-shipments admin-empty-state" role="alert"><div className="admin-empty-icon"><Boxes size={25} /></div><h2>Shipments could not be loaded.</h2><p>Check that the SwiftSurge shipments schema has been applied in Supabase.</p></section>
          : shipments?.length ? <section className="admin-shipments">
            <div className="admin-section-head"><div><h2>All shipments</h2><p>{shipments.length} shipment{shipments.length === 1 ? '' : 's'} in your workspace</p></div></div>
            <div className="admin-table-wrap"><table><thead><tr><th>TRACKING ID</th><th>SENDER</th><th>RECEIVER</th><th>ROUTE</th><th>STATUS</th><th>EST. DELIVERY</th><th>ACTIONS</th></tr></thead>
              <tbody>{shipments.map((shipment) => <tr key={shipment.id}>
                <td><Link href={`/shipments/${shipment.id}`} className="admin-shipment-link"><strong>{shipment.tracking_number}</strong></Link></td><td>{shipment.sender_name || '—'}</td><td>{shipment.receiver_name || '—'}</td>
                <td>{shipment.origin || '—'} → {shipment.destination || '—'}</td><td><span className="status-pill"><i />{statusLabels[shipment.status] || shipment.status.replaceAll('_', ' ').replaceAll('-', ' ')}</span></td>
                <td>{shipment.estimated_delivery || '—'}</td><td><ShipmentActionsMenu id={shipment.id} trackingNumber={shipment.tracking_number}/></td>
              </tr>)}</tbody></table></div>
          </section> : <section className="admin-shipments admin-empty-state" aria-label="No shipments">
            <div className="admin-empty-icon"><Boxes size={25} /></div>
            <span className="eyebrow">NO SHIPMENTS YET</span>
            <h2>Your shipment list is empty.</h2>
            <p>New shipment records, tracking updates, and customer documents will appear here after you create a shipment.</p>
            <div className="admin-empty-actions"><Link className="button button-green" href="/shipments/new"><Plus size={16} /> Create first shipment</Link></div>
          </section>}
      </div>
    </main>
  </div>;
}
