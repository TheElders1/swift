import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText, MapPin, PackageCheck } from 'lucide-react';
import { UpdateTrackingForm } from '@/components/admin/update-tracking-form';
import { RemoveTrackingHistoryButton } from '@/components/admin/remove-tracking-history-button';
import { createClient } from '@/utils/supabase/server';
import { formatCurrency } from '@/utils/format-currency';

export const metadata: Metadata = { title: 'Shipment details · Operations' };
const displayDate = (value: string | null) => {
  if (!value) return '—';
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed);
};
const displayTimestamp = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
};
const statusLabels: Record<string, string> = { pending: 'Pending 📋', collected: 'Collected 📦', in_transit: 'In transit 🚚', out_for_delivery: 'Out for delivery 🛵', delivered: 'Delivered ✅', delayed: 'Delayed ⚠️', cancelled: 'Cancelled' };
const label = (value: string) => statusLabels[value] || value.replaceAll('_', ' ').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: shipment, error }, { data: history }] = await Promise.all([
    supabase.from('shipments').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
    supabase.from('tracking_history').select('id,status,location,lat,lng,note,progress_percent,created_at').eq('shipment_id', id).order('created_at', { ascending: false }),
  ]);
  if (error || !shipment) notFound();
  const money = formatCurrency(shipment.shipment_amount, shipment.currency || shipment.shipment_currency);
  const currentLocation = history?.[0]?.location || '';

  return <div className="shipment-detail-page">
    <header className="shipment-detail-toolbar"><Link href="/shipments"><ArrowLeft size={16} /> Back to shipments</Link><div><Link href={`/shipments/${shipment.id}/edit`}>Edit shipment</Link><Link href={`/shipments/${shipment.id}/pdf/1`}><FileText size={15} /> Waybill</Link><Link href={`/shipments/${shipment.id}/pdf/2`}>Details PDF</Link><Link href={`/shipments/${shipment.id}/pdf/3`}>Receipt PDF</Link></div></header>
    <main className="shipment-detail-content">
      <div className="shipment-detail-heading"><span className="eyebrow">SHIPMENT RECORD</span><h1>{shipment.tracking_number}</h1><p>{shipment.origin || 'Origin not set'} <span>→</span> {shipment.destination || 'Destination not set'}</p><span className="shipment-detail-status">{label(shipment.status)}</span></div>
      {shipment.package_image_url && <div className="shipment-parcel-photo"><img src={shipment.package_image_url} alt={`Parcel for shipment ${shipment.tracking_number}`} /></div>}
      <section className="shipment-detail-card"><h2><PackageCheck size={18} /> Shipment details</h2><div className="shipment-info-grid">
        <div><span>Description</span><strong>{shipment.description || '—'}</strong></div><div><span>Package type</span><strong>{shipment.package_type || '—'}</strong></div><div><span>Weight</span><strong>{shipment.weight_kg === null ? '—' : `${shipment.weight_kg} kg`}</strong></div><div><span>Shipment amount</span><strong>{money}</strong></div><div><span>Shipped from</span><strong>{shipment.origin || '—'}</strong></div><div><span>Destination</span><strong>{shipment.destination || '—'}</strong></div><div><span>Shipment date</span><strong>{displayDate(shipment.shipment_date)}</strong></div><div><span>Expected delivery</span><strong>{displayDate(shipment.estimated_delivery)}</strong></div><div><span>Last location</span><strong>{currentLocation || 'Location not updated'}</strong></div>
      </div></section>
      <section className="shipment-parties-grid"><article className="shipment-detail-card"><h2>From</h2><strong>{shipment.sender_name || '—'}</strong><p>{shipment.sender_address || 'Address not provided'}</p><small>{shipment.sender_email || '—'}<br />{shipment.sender_phone || '—'}</small></article><article className="shipment-detail-card"><h2>To</h2><strong>{shipment.receiver_name || '—'}</strong><p>{shipment.receiver_address || 'Address not provided'}</p><small>{shipment.receiver_email || '—'}<br />{shipment.receiver_phone || '—'}</small></article></section>
      <section id="history" className="shipment-history-panel"><div className="shipment-history-heading"><div><span className="eyebrow">TRACKING</span><h2>Location history</h2><p>Current location: {currentLocation || 'Location not updated'}</p></div><UpdateTrackingForm shipmentId={shipment.id} status={shipment.status} currentLat={shipment.current_lat} currentLng={shipment.current_lng} currentLocation={currentLocation} /></div>
        {history?.length ? <ol className="shipment-history-timeline">{history.map((event, index) => <li key={event.id}><span className="shipment-history-marker"><MapPin size={13} /></span><article><div className="shipment-history-event-head"><strong>{label(event.status)}</strong><time>{displayTimestamp(event.created_at)}</time><RemoveTrackingHistoryButton shipmentId={shipment.id} historyId={event.id} isLatest={index === 0} /></div><p>{event.location || 'Location not provided'}</p>{event.note && <small>{event.note}</small>}{event.progress_percent !== null && <span className="shipment-progress-label">{event.progress_percent}% complete</span>}</article></li>)}</ol> : <div className="shipment-history-empty">No tracking updates have been added yet.</div>}
      </section>
      {shipment.shipment_comments && <p className="shipment-comments"><strong>Shipment comments:</strong> {shipment.shipment_comments}</p>}
    </main>
  </div>;
}
