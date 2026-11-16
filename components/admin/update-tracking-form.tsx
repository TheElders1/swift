'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Save, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { LocationCoordinateFields } from '@/components/admin/location-coordinate-fields';

const progressForStatus: Record<string, number> = { pending: 0, collected: 25, in_transit: 50, out_for_delivery: 75, delivered: 100, delayed: 50, cancelled: 0 };

export function UpdateTrackingForm({ shipmentId, status, currentLat, currentLng, currentLocation = '' }: { shipmentId: string; status: string; currentLat: number | null; currentLng: number | null; currentLocation?: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true); setMessage(''); setFailure(false);
    const form = new FormData(formElement);
    const selectedStatus = String(form.get('status') || 'in_transit');
    const customStatus = String(form.get('custom_status') || '').trim();
    const nextStatus = selectedStatus === 'custom' ? customStatus : selectedStatus;
    const progressValue = String(form.get('progress_percent') || '').trim();
    if (!nextStatus) {
      setBusy(false);
      setFailure(true);
      setMessage('Enter a custom status, including any emoji you want to show.');
      return;
    }
    const location = String(form.get('location') || '').trim() || null;
    const latValue = String(form.get('lat') || '').trim();
    const lngValue = String(form.get('lng') || '').trim();
    const lat = latValue ? Number(latValue) : null;
    const lng = lngValue ? Number(lngValue) : null;
    if (!location || lat === null || lng === null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      setBusy(false);
      setFailure(true);
      setMessage('Set a location and generate or enter both coordinates before saving so the map can update.');
      return;
    }
    const note = String(form.get('note') || '').trim() || null;
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.from('shipments').update({
        status: nextStatus,
        current_lat: lat,
        current_lng: lng,
      }).eq('id', shipmentId);
      if (updateError) throw new Error(updateError.message);

      const { error: historyError } = await supabase.from('tracking_history').insert({
        shipment_id: shipmentId,
        status: nextStatus,
        location,
        lat,
        lng,
        note,
        progress_percent: progressValue ? Math.max(0, Math.min(100, Number(progressValue))) : (progressForStatus[nextStatus] ?? progressForStatus[status] ?? 0),
      });
      if (historyError) throw new Error(`Shipment status changed, but the history entry was not saved: ${historyError.message}`);
      setMessage('Tracking update saved.');
      formElement.reset();
      router.refresh();
    } catch (error) {
      setFailure(true);
      setMessage(error instanceof Error ? error.message : 'Could not save this tracking update.');
    } finally { setBusy(false); }
  }

  return <div className="tracking-update-wrap">
    {!open ? <button className="button button-green tracking-update-toggle" type="button" onClick={() => setOpen(true)}><MapPin size={15} /> Update location</button> : <form className="tracking-update-form" onSubmit={submit}>
      <div className="tracking-update-title"><div><strong>New tracking update</strong><span>Add a shipment status and its current location.</span></div><button type="button" aria-label="Close update form" onClick={() => setOpen(false)}><X size={17} /></button></div>
      <div className="tracking-update-fields"><label>Status<select name="status" defaultValue={['pending','collected','in_transit','out_for_delivery','delivered','delayed','cancelled'].includes(status) ? status : 'custom'}><option value="pending">Pending</option><option value="collected">Collected 📦</option><option value="in_transit">In transit 🚚</option><option value="out_for_delivery">Out for delivery 🛵</option><option value="delivered">Delivered ✅</option><option value="delayed">Delayed ⚠️</option><option value="cancelled">Cancelled</option><option value="custom">Custom status…</option></select></label><LocationCoordinateFields locationName="location" defaultLocation={currentLocation} defaultLat={currentLat} defaultLng={currentLng} required/><label className="tracking-custom-status">Custom status<input name="custom_status" defaultValue={['pending','collected','in_transit','out_for_delivery','delivered','delayed','cancelled'].includes(status) ? '' : status} placeholder="Add a status and emoji, e.g. Customs cleared ✅" /></label><label>Progress (optional)<input name="progress_percent" type="number" min="0" max="100" placeholder="Auto by status" /></label><label className="tracking-note-field">Update note (optional)<textarea name="note" rows={2} placeholder="Add a short update for the tracking history" /></label></div>
      {message && <p className={failure ? 'shipment-form-error' : 'tracking-update-success'} role="status">{message}</p>}
      <button className="button button-green" type="submit" disabled={busy}>{busy ? 'Saving…' : <><Save size={15} /> Save location update</>}</button>
    </form>}
  </div>;
}
