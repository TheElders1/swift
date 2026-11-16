'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { LocationCoordinateFields } from '@/components/admin/location-coordinate-fields';

type ShipmentValues = {
  id: string;
  tracking_number: string;
  sender_name: string | null; sender_address: string | null; sender_email: string | null; sender_phone: string | null;
  receiver_name: string | null; receiver_address: string | null; receiver_email: string | null; receiver_phone: string | null;
  origin: string | null; destination: string | null; description: string | null; shipment_comments: string | null;
  package_type: string | null; weight_kg: number | null; shipment_amount: number | null; currency: string | null;
  shipment_date: string | null; estimated_delivery: string | null;
  current_lat: number | null; current_lng: number | null; status: string;
};

const fields: { name: keyof Omit<ShipmentValues, 'id' | 'tracking_number'>; label: string; type?: string; wide?: boolean }[] = [
  { name: 'sender_name', label: 'Sender name' }, { name: 'sender_address', label: 'Sender address', wide: true },
  { name: 'sender_phone', label: 'Sender phone' }, { name: 'sender_email', label: 'Sender email', type: 'email' },
  { name: 'receiver_name', label: 'Receiver name' }, { name: 'receiver_address', label: 'Receiver address', wide: true },
  { name: 'receiver_phone', label: 'Receiver phone' }, { name: 'receiver_email', label: 'Receiver email', type: 'email' },
  { name: 'origin', label: 'Shipped from' }, { name: 'destination', label: 'Destination' },
  { name: 'package_type', label: 'Package type' }, { name: 'weight_kg', label: 'Weight (kg)', type: 'number' },
  { name: 'shipment_date', label: 'Shipment date', type: 'date' }, { name: 'estimated_delivery', label: 'Expected delivery', type: 'date' },
  { name: 'shipment_amount', label: 'Shipment amount', type: 'number' }, { name: 'currency', label: 'Currency' },
  { name: 'description', label: 'Parcel description', wide: true }, { name: 'shipment_comments', label: 'Shipment comments', wide: true },
];

export function EditShipmentForm({ shipment, currentLocation = '' }: { shipment: ShipmentValues; currentLocation?: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    const updates: Record<string, string | number | null> = {};
    fields.forEach(({ name, type }) => {
      const value = String(formData.get(name) ?? '').trim();
      updates[name] = value === '' ? null : type === 'number' ? Number(value) : value;
    });
    updates.shipment_currency = updates.currency;
    const nextLocation = String(formData.get('current_location') || '').trim();
    const nextLat = String(formData.get('lat') || '').trim();
    const nextLng = String(formData.get('lng') || '').trim();
    const locationChanged = Boolean(nextLocation) && nextLocation !== (currentLocation || '');
    const coordinatesChanged = (nextLat ? Number(nextLat) : null) !== shipment.current_lat || (nextLng ? Number(nextLng) : null) !== shipment.current_lng;
    if (nextLocation && (!nextLat || !nextLng)) {
      setBusy(false);
      setError('Generate coordinates by leaving the location field, or enter both coordinates manually before saving.');
      return;
    }
    try {
      const supabase = createClient();
      if (nextLat && nextLng) {
        updates.current_lat = Number(nextLat);
        updates.current_lng = Number(nextLng);
      }
      const { error: updateError } = await supabase.from('shipments').update(updates).eq('id', shipment.id);
      if (updateError) throw new Error(updateError.message);
      if (locationChanged || coordinatesChanged) {
        const { error: historyError } = await supabase.from('tracking_history').insert({
          shipment_id: shipment.id,
          status: shipment.status,
          location: nextLocation || null,
          lat: nextLat ? Number(nextLat) : null,
          lng: nextLng ? Number(nextLng) : null,
          note: 'Current shipment location updated',
        });
        if (historyError) throw new Error(`Shipment was saved, but its location history could not be updated: ${historyError.message}`);
      }
      router.push(`/shipments/${shipment.id}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save shipment changes.');
    } finally { setBusy(false); }
  }

  return <form className="shipment-create-form shipment-edit-form" onSubmit={save}>
    <div className="shipment-create-head"><Link href={`/shipments/${shipment.id}`}><ArrowLeft size={16} /> Shipment details</Link><span className="eyebrow">OPERATIONS / EDIT SHIPMENT</span><h1>Edit shipment</h1><p>Update the shipment record below. The tracking number stays the same.</p></div>
    {error && <p className="shipment-form-error" role="alert">{error}</p>}
    <section className="shipment-form-card"><header><span>01</span><div><h2>Shipment information</h2><p>Make corrections to contact, route, parcel, or billing details.</p></div></header><div className="shipment-form-grid">
      <label className="field-wide">Tracking number<input value={shipment.tracking_number} readOnly /></label>
      {fields.map(({ name, label, type = 'text', wide }) => <label key={name} className={wide ? 'field-wide' : undefined}>{label}<input name={name} type={type} step={type === 'number' ? 'any' : undefined} defaultValue={shipment[name] ?? ''} /></label>)}
      <LocationCoordinateFields locationName="current_location" defaultLocation={currentLocation} defaultLat={shipment.current_lat} defaultLng={shipment.current_lng} />
    </div></section>
    <div className="shipment-form-submit"><p>Saving updates the shipment details used on its PDFs and tracking page.</p><button className="button button-green" type="submit" disabled={busy}>{busy ? 'Saving changes…' : <><Save size={16} /> Save changes</>}</button></div>
  </form>;
}
