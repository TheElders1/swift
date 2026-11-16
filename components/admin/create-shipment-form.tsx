'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, LoaderCircle, PackagePlus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type FormValues = Record<string, FormDataEntryValue | null>;
const progressForStatus: Record<string, number> = { pending: 0, collected: 25, in_transit: 50, out_for_delivery: 75, delivered: 100, delayed: 50, cancelled: 0 };
const trackingCode = () => `SS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
const numeric = (value: FormDataEntryValue | null) => value === null || value === '' ? null : Number(value);
const textOrNull = (value: FormDataEntryValue | null) => typeof value === 'string' && value.trim() ? value.trim() : null;

export function CreateShipmentForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedNumber, setSavedNumber] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries()) as FormValues;
    const selectedFile = formData.get('package_image');
    const status = String(values.status || 'pending');
    const tracking_number = trackingCode();

    try {
      const supabase = createClient();
      let package_image_url: string | null = null;

      if (selectedFile instanceof File && selectedFile.size > 0) {
        if (!selectedFile.type.startsWith('image/')) throw new Error('Choose an image file for the parcel photo.');
        if (selectedFile.size > 5 * 1024 * 1024) throw new Error('Parcel images must be 5 MB or smaller.');
        const ext = selectedFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const storagePath = `${tracking_number}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('shipment-images').upload(storagePath, selectedFile, { contentType: selectedFile.type, upsert: false });
        if (uploadError) throw new Error(`Parcel photo upload failed: ${uploadError.message}`);
        package_image_url = supabase.storage.from('shipment-images').getPublicUrl(storagePath).data.publicUrl;
      }

      const origin_lat = numeric(values.origin_lat);
      const origin_lng = numeric(values.origin_lng);
      const shipment = {
        tracking_number,
        sender_name: textOrNull(values.sender_name),
        sender_address: textOrNull(values.sender_address),
        sender_phone: textOrNull(values.sender_phone),
        sender_email: textOrNull(values.sender_email),
        receiver_name: textOrNull(values.receiver_name),
        receiver_address: textOrNull(values.receiver_address),
        receiver_phone: textOrNull(values.receiver_phone),
        receiver_email: textOrNull(values.receiver_email),
        description: textOrNull(values.description),
        weight_kg: numeric(values.weight_kg),
        shipment_comments: textOrNull(values.shipment_comments),
        origin: textOrNull(values.origin),
        destination: textOrNull(values.destination),
        estimated_delivery: textOrNull(values.estimated_delivery),
        shipment_date: textOrNull(values.shipment_date),
        package_image_url,
        notification_type: textOrNull(values.notification_type),
        origin_lat,
        origin_lng,
        destination_lat: numeric(values.destination_lat),
        destination_lng: numeric(values.destination_lng),
        current_lat: numeric(values.current_lat) ?? origin_lat,
        current_lng: numeric(values.current_lng) ?? origin_lng,
        status,
        package_type: textOrNull(values.package_type),
        shipment_amount: numeric(values.shipment_amount),
        currency: String(values.currency || 'USD'),
        shipment_currency: String(values.currency || 'USD'),
      };

      const { data: saved, error: insertError } = await supabase.from('shipments').insert(shipment).select('id,tracking_number').single();
      if (insertError) throw new Error(insertError.message);

      const { error: historyError } = await supabase.from('tracking_history').insert({
        shipment_id: saved.id,
        status,
        location: shipment.origin,
        lat: shipment.current_lat,
        lng: shipment.current_lng,
        note: 'Shipment created',
        progress_percent: progressForStatus[status] ?? 0,
      });

      setSavedNumber(saved.tracking_number);
      if (historyError) setErrorMessage(`Shipment saved, but its first history entry could not be saved: ${historyError.message}`);
      else form.reset();
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not save the shipment. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (savedNumber) return <section className="shipment-saved-card">
    <CheckCircle2 size={38} />
    <span className="eyebrow">SHIPMENT CREATED</span>
    <h2>{savedNumber}</h2>
    <p>The shipment has been added to your SwiftSurge workspace.</p>
    {errorMessage && <p className="shipment-form-error" role="alert">{errorMessage}</p>}
    <div className="shipment-saved-actions"><Link className="button button-green" href="/shipments">View shipments</Link><button className="button button-outline-dark" type="button" onClick={() => { setSavedNumber(''); setErrorMessage(''); }}>Create another</button></div>
  </section>;

  return <form className="shipment-create-form" onSubmit={handleSubmit}>
    <div className="shipment-create-head"><Link href="/shipments"><ArrowLeft size={16} /> Shipments</Link><span className="eyebrow">OPERATIONS / NEW SHIPMENT</span><h1>Create new shipment</h1><p>Enter the sender, recipient, and parcel details. SwiftSurge will generate a tracking code when you save.</p></div>

    {errorMessage && <p className="shipment-form-error" role="alert">{errorMessage}</p>}

    <section className="shipment-form-card"><header><span>01</span><div><h2>Sender information</h2><p>Details about the person sending the parcel.</p></div></header><div className="shipment-form-grid">
      <label>Name<input name="sender_name" autoComplete="name" placeholder="Sender name" required /></label>
      <label>Address &amp; country<input name="sender_address" autoComplete="street-address" placeholder="Street, city, country" /></label>
      <label>Phone<input name="sender_phone" type="tel" autoComplete="tel" placeholder="Sender phone number" /></label>
      <label>Email<input name="sender_email" type="email" autoComplete="email" placeholder="Sender email address" /></label>
    </div></section>

    <section className="shipment-form-card"><header><span>02</span><div><h2>Client information</h2><p>Details about the person receiving the parcel.</p></div></header><div className="shipment-form-grid">
      <label>Name<input name="receiver_name" placeholder="Recipient name" required /></label>
      <label>Address &amp; country<input name="receiver_address" placeholder="Street, city, country" /></label>
      <label>Phone<input name="receiver_phone" type="tel" placeholder="Recipient phone number" /></label>
      <label>Email<input name="receiver_email" type="email" placeholder="Recipient email address" /></label>
    </div></section>

    <section className="shipment-form-card"><header><span>03</span><div><h2>Parcel information</h2><p>Route, service, dates, and package details.</p></div></header><div className="shipment-form-grid">
      <label className="field-wide">Description<input name="description" placeholder="What the parcel contains" /></label>
      <label>Weight (kg)<input name="weight_kg" type="number" min="0" step="any" placeholder="e.g. 2.5" /></label>
      <label>Package type<input name="package_type" placeholder="Parcel, document, freight…" /></label>
      <label>Shipment comments<input name="shipment_comments" placeholder="Handling notes or other comments" /></label>
      <label>Destination<input name="destination" placeholder="City, country" required /></label>
      <label>Shipped from<input name="origin" placeholder="City, country" required /></label>
      <label>Expected delivery<input name="estimated_delivery" type="date" /></label>
      <label>Date of shipment<input name="shipment_date" type="date" /></label>
      <label>Declared amount<input name="shipment_amount" type="number" min="0" step="any" placeholder="Optional" /></label>
      <label>Currency<select name="currency" defaultValue="USD"><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="NGN">NGN (₦)</option><option value="CAD">CAD ($)</option><option value="AUD">AUD ($)</option></select></label>
      <label>Initial status<select name="status" defaultValue="pending"><option value="pending">Pending</option><option value="in_transit">In transit</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option><option value="delayed">Delayed</option><option value="cancelled">Cancelled</option></select></label>
      <label>Send notification<select name="notification_type" defaultValue="EMAIL"><option value="EMAIL">Email preference</option><option value="SMS">SMS preference</option><option value="NONE">No notification</option></select><small>Preference is recorded. Sending requires an email or SMS provider.</small></label>
      <label className="field-wide">Parcel image<input name="package_image" type="file" accept="image/*" /><small>Optional image, up to 5 MB.</small></label>
    </div></section>

    <details className="shipment-coordinates"><summary>Optional live location coordinates</summary><div className="shipment-form-grid">
      <label>Origin latitude<input name="origin_lat" type="number" step="any" placeholder="Latitude" /></label><label>Origin longitude<input name="origin_lng" type="number" step="any" placeholder="Longitude" /></label>
      <label>Destination latitude<input name="destination_lat" type="number" step="any" placeholder="Latitude" /></label><label>Destination longitude<input name="destination_lng" type="number" step="any" placeholder="Longitude" /></label>
      <label>Current latitude<input name="current_lat" type="number" step="any" placeholder="Defaults to origin" /></label><label>Current longitude<input name="current_lng" type="number" step="any" placeholder="Defaults to origin" /></label>
    </div></details>

    <div className="shipment-form-submit"><p>Tracking code is generated automatically. The shipment and its first tracking-history entry are saved to Supabase.</p><button className="button button-green" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="login-spinner" size={17} /> Saving shipment…</> : <><PackagePlus size={17} /> Save shipment</>}</button></div>
  </form>;
}
