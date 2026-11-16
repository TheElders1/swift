import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { ShipmentTrashActions } from '@/components/admin/shipment-trash-actions';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = { title: 'Trash · Shipments' };

export default async function ShipmentTrashPage() {
  const supabase = await createClient();
  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('id,tracking_number,sender_name,receiver_name,origin,destination,deleted_at,package_image_url')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  return <div className="admin-page">
    <aside className="admin-sidebar">
      <Link className="brand" href="/"><img className="brand-logo" src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics" /></Link>
      <div className="admin-nav-label">WORKSPACE</div>
      <Link className="admin-nav" href="/shipments"><ArrowLeft/>Shipments</Link>
      <Link className="admin-nav active" href="/shipments/trash"><Trash2/>Trash</Link>
      <div className="admin-sidebar-bottom"><strong>Operations workspace</strong><span>Restore shipments or permanently remove records you no longer need.</span></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div className="admin-breadcrumb">Workspace <span>/</span> Trash</div><Link className="button button-outline-dark" href="/shipments"><ArrowLeft size={15}/> Back to shipments</Link></header>
      <div className="admin-content">
        <div className="admin-heading"><div><span className="eyebrow">SHIPMENT MANAGEMENT</span><h1>Trash</h1><p>Items stay in Trash until you restore or permanently delete them.</p></div></div>
        {error ? <section className="admin-shipments admin-empty-state" role="alert"><h2>Trash could not be loaded.</h2><p>Apply the shipment trash migration in Supabase, then reload this page.</p></section>
          : shipments?.length ? <section className="admin-shipments"><div className="admin-section-head"><div><h2>Deleted shipments</h2><p>{shipments.length} item{shipments.length === 1 ? '' : 's'} in Trash</p></div></div>
            <div className="admin-table-wrap"><table><thead><tr><th>TRACKING ID</th><th>SENDER</th><th>RECEIVER</th><th>ROUTE</th><th>IN TRASH SINCE</th><th>ACTIONS</th></tr></thead><tbody>{shipments.map((shipment) => <tr key={shipment.id}>
              <td><strong>{shipment.tracking_number}</strong></td><td>{shipment.sender_name || '—'}</td><td>{shipment.receiver_name || '—'}</td><td>{shipment.origin || '—'} → {shipment.destination || '—'}</td>
              <td>{shipment.deleted_at ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(shipment.deleted_at)) : '—'}</td>
              <td><ShipmentTrashActions id={shipment.id} trackingNumber={shipment.tracking_number} imageUrl={shipment.package_image_url}/></td>
            </tr>)}</tbody></table></div>
          </section> : <section className="admin-shipments admin-empty-state"><div className="admin-empty-icon"><Trash2 size={24}/></div><span className="eyebrow">TRASH IS EMPTY</span><h2>No deleted shipments.</h2><p>When you move a shipment to Trash, it will appear here for restore or immediate permanent deletion.</p><div className="admin-empty-actions"><Link className="button button-green" href="/shipments"><ArrowLeft size={15}/> Return to shipments</Link></div></section>}
      </div>
    </main>
  </div>;
}
