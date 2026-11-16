'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowRight, Box, CircleHelp, Globe2, LoaderCircle, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { TrackingMap } from '@/components/tracking-map';
import { formatCurrency } from '@/utils/format-currency';

type TrackingEvent = { status: string; location: string | null; lat: number | null; lng: number | null; note: string | null; progress_percent: number | null; created_at: string };
type TrackingResult = { tracking_number: string; status: string; sender_name: string | null; sender_address: string | null; sender_email: string | null; sender_phone: string | null; receiver_name: string | null; receiver_address: string | null; receiver_email: string | null; receiver_phone: string | null; origin: string | null; destination: string | null; description: string | null; package_type: string | null; package_image_url: string | null; weight_kg: number | null; shipment_amount: number | null; currency: string | null; shipment_date: string | null; estimated_delivery: string | null; current_lat: number | null; current_lng: number | null; origin_lat: number | null; origin_lng: number | null; destination_lat: number | null; destination_lng: number | null; progress_percent: number; history: TrackingEvent[] };
const statusLabels: Record<string, string> = { pending: 'Pending 📋', collected: 'Collected 📦', in_transit: 'In transit 🚚', out_for_delivery: 'Out for delivery 🛵', delivered: 'Delivered ✅', delayed: 'Delayed ⚠️', cancelled: 'Cancelled' };
const statusText = (value: string) => statusLabels[value] || value.replaceAll('_', ' ').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatDate = (value: string | null) => {
  if (!value) return '—';
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed);
};
const formatTimestamp = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
};
const journeySteps = [
  { key: 'pending', label: 'Booked' },
  { key: 'collected', label: 'Collected' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];
const defaultProgress: Record<string, number> = { pending: 5, collected: 25, in_transit: 50, out_for_delivery: 75, delivered: 100 };

function journeyProgress(status: string, percent: number) {
  if (status === 'cancelled') return 0;
  if (status === 'delayed') return Math.max(percent, 50);
  const index = journeySteps.findIndex((step) => step.key === status);
  return Math.max(0, Math.min(100, percent || defaultProgress[status] || (index >= 0 ? Math.round(((index + 1) / journeySteps.length) * 100) : 0)));
}

function ShipmentJourney({ result }: { result: TrackingResult }) {
  const target = journeyProgress(result.status, result.progress_percent);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || target === 0) {
      setProgress(target);
      return;
    }

    let frame = 0;
    let startedAt = 0;
    const duration = 1400;
    const animate = (time: number) => {
      if (!startedAt) startedAt = time;
      const fraction = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - fraction, 3);
      setProgress(target * eased);
      if (fraction < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const shownPercent = Math.round(progress);
  const style = { '--journey-progress': `${progress}%` } as CSSProperties;

  return <div className="tracking-journey" style={style} role="progressbar" aria-label="Shipment journey progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shownPercent}>
    <div className="tracking-journey-head"><span>SHIPMENT JOURNEY</span><strong>{shownPercent}%</strong></div>
    <div className="tracking-journey-track"><div className="tracking-journey-fill"/><span className="tracking-journey-marker"><Truck size={15}/></span>{journeySteps.map((step, index) => <span key={step.key} className={`tracking-journey-stop${shownPercent >= [5,25,50,75,100][index] ? ' is-complete' : ''}`} style={{ left: `${index * 25}%` }}><i/></span>)}</div>
    <div className="tracking-journey-labels">{journeySteps.map((step) => <span key={step.key}>{step.label}</span>)}</div>
  </div>;
}

const lookupStages = [
  'Connecting to SwiftSurge tracking…',
  'Checking shipment and container details…',
  'Gathering route and latest transit hub updates…',
  'Preparing location and delivery milestones…',
];

function TrackingLookupLoader({ complete }: { complete: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (complete) {
      setStage(lookupStages.length - 1);
      return;
    }
    setStage(0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, lookupStages.length - 1)), 400);
    return () => window.clearInterval(timer);
  }, [complete]);

  const progress = complete ? 100 : [14, 38, 64, 88][stage];

  return <div className="tracking-lookup-loader" role="status" aria-live="polite">
    <span className="tracking-loader-icon is-spinning"><Globe2 size={23}/></span>
    <div className="tracking-loader-copy" key={complete ? 'complete' : stage}>
      <strong>{complete ? 'Shipment located' : 'Gathering shipment information'}</strong>
      <span>{complete ? 'Opening your delivery journey…' : lookupStages[stage]}</span>
    </div>
    <div className="tracking-loader-track" aria-hidden="true"><i style={{ width: `${progress}%` }}/></div>
    <small>{complete ? 'Ready to track' : 'Securely checking shipment details'}</small>
  </div>;
}

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export function TrackingView({ initialCode = '' }: { initialCode?: string }) {
  const codeInput = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);

  const lookupTracking = useCallback(async (searchCode: string) => {
    setBusy(true); setLoaderComplete(false); setError(''); setResult(null);
    const startedAt = Date.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const { data, error: requestError } = await createClient().rpc('track_shipment', { p_tracking_number: searchCode.trim() });
      if (requestError) throw new Error('Tracking is temporarily unavailable. Please try again.');
      if (!data) throw new Error('We could not find a shipment with that tracking number. Check it and try again.');
      if (!reducedMotion) {
        const remaining = 1500 - (Date.now() - startedAt);
        if (remaining > 0) await wait(remaining);
      }
      setLoaderComplete(true);
      if (!reducedMotion) await wait(280);
      setResult(data as TrackingResult);
    } catch (lookupError) {
      if (!reducedMotion) {
        const remaining = 1500 - (Date.now() - startedAt);
        if (remaining > 0) await wait(remaining);
      }
      setLoaderComplete(true);
      if (!reducedMotion) await wait(280);
      setError(lookupError instanceof Error ? lookupError.message : 'Could not look up this shipment. Please try again.');
    } finally { setBusy(false); }
  }, []);

  useEffect(() => {
    if (initialCode.trim()) { setCode(initialCode); void lookupTracking(initialCode); }
  }, [initialCode, lookupTracking]);

  function findShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookupTracking(code);
  }

  function trackAnotherItem() {
    setResult(null);
    setError('');
    setCode('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => codeInput.current?.focus(), 350);
  }

  const shipmentAmount = result?.shipment_amount === null || result?.shipment_amount === undefined
    ? null
    : formatCurrency(result.shipment_amount, result.currency);
  const latestUpdate = result?.history?.[0];
  const mapPoints = result ? [
    ...(result.origin_lat !== null && result.origin_lng !== null ? [{ lat: result.origin_lat, lng: result.origin_lng, label: `Origin · ${result.origin || 'Shipment origin'}`, kind: 'origin' as const }] : []),
    ...(result.history || []).slice().reverse().filter((item) => item.lat !== null && item.lng !== null).map((item) => ({ lat: item.lat, lng: item.lng, label: `${statusText(item.status)} · ${item.location || 'Tracking update'}`, kind: 'history' as const })),
    ...(result.current_lat !== null && result.current_lng !== null ? [{ lat: result.current_lat, lng: result.current_lng, label: `Latest location · ${latestUpdate?.location || result.status}`, kind: 'current' as const }] : []),
    ...(result.destination_lat !== null && result.destination_lng !== null ? [{ lat: result.destination_lat, lng: result.destination_lng, label: `Destination · ${result.destination || 'Delivery destination'}`, kind: 'destination' as const }] : []),
  ] : [];

  return <div className="track-page">
    <section className="track-page-hero"><div className="container"><span className="eyebrow eyebrow-green">YOUR SHIPMENT, IN VIEW</span><h1>Know where<br/><em>you stand.</em></h1><p>Follow your shipment from collection to delivery with a simple tracking reference.</p></div></section>
    <section className="container track-page-content">
      <div className="track-page-card"><div className="track-card-head"><span className="track-big-icon"><PackageCheck/></span><span className="eyebrow">SWIFTSURGE TRACKING</span><h2>Let’s find your shipment.</h2><p>Enter the tracking number shared with you when your shipment was booked.</p></div>
        <form onSubmit={findShipment}><label htmlFor="track-code">Tracking number</label><div className="track-input track-input-page"><Box size={19}/><input ref={codeInput} id="track-code" value={code} onChange={event => { setCode(event.target.value); setResult(null); setError(''); }} placeholder="Enter tracking number" required/><button aria-label="Find shipment" disabled={busy}>{busy ? <LoaderCircle className="login-spinner"/> : <ArrowRight/>}</button></div><button className="button button-green track-submit" disabled={busy}>{busy ? 'Searching…' : <>Track shipment <ArrowRight size={17}/></>}</button></form>
        <div className="track-safe"><ShieldCheck size={17}/><span>Shipment contact and parcel details are shown to help identify this delivery.</span></div>
        {busy && <TrackingLookupLoader complete={loaderComplete}/>}
        {error && <p className="tracking-lookup-error" role="alert">{error}</p>}
        {result && <section className="tracking-result" aria-live="polite" key={result.tracking_number}><div className="tracking-result-top"><div><span>TRACKING ID</span><strong>{result.tracking_number}</strong></div><span className="tracking-result-status">{statusText(result.status)}</span></div><div className="tracking-result-route"><div><span>ORIGIN</span><strong>{result.origin || '—'}</strong></div><ArrowRight size={16}/><div><span>DESTINATION</span><strong>{result.destination || '—'}</strong></div></div><ShipmentJourney result={result}/><div className="tracking-result-facts"><span>{result.package_type || 'Parcel'}</span>{result.weight_kg !== null && <span>{result.weight_kg} kg</span>}<span>Expected: {result.estimated_delivery || 'To be confirmed'}</span></div>
          <section className="tracking-contact-card"><h3>Contact SwiftSurge</h3><p>Need help with this shipment? Our team is here to assist.</p><p>Email: <a href="mailto:contact@swiftsurge.example">contact@swiftsurge.example</a></p><p>For regional office and phone details, contact your shipment representative.</p></section>
          <section className="tracking-parties-card"><article><span>FROM</span><h3>{result.sender_name || 'Sender details not provided'}</h3><p>{result.sender_address || 'Address not provided'}</p>{result.sender_email && <a href={`mailto:${result.sender_email}`}>{result.sender_email}</a>}{result.sender_phone && <a href={`tel:${result.sender_phone}`}>{result.sender_phone}</a>}</article><article><span>TO</span><h3>{result.receiver_name || 'Recipient details not provided'}</h3><p>{result.receiver_address || 'Address not provided'}</p>{result.receiver_email && <a href={`mailto:${result.receiver_email}`}>{result.receiver_email}</a>}{result.receiver_phone && <a href={`tel:${result.receiver_phone}`}>{result.receiver_phone}</a>}</article></section>
          <section className="tracking-shipment-details"><h3>Shipment details</h3><dl><div><dt>Tracking ID</dt><dd>{result.tracking_number}</dd></div><div><dt>Description</dt><dd>{result.description || '—'}</dd></div><div><dt>Status</dt><dd>{statusText(result.status)}</dd></div><div><dt>Package type</dt><dd>{result.package_type || '—'}</dd></div><div><dt>Weight</dt><dd>{result.weight_kg === null ? '—' : `${result.weight_kg} kg`}</dd></div><div><dt>Shipped from</dt><dd>{result.origin || '—'}</dd></div><div><dt>Shipped to</dt><dd>{result.destination || '—'}</dd></div><div><dt>Date of shipment</dt><dd>{formatDate(result.shipment_date)}</dd></div><div><dt>Expected delivery</dt><dd>{formatDate(result.estimated_delivery)}</dd></div><div><dt>Shipped by</dt><dd>SwiftSurge Logistics</dd></div>{shipmentAmount && <div><dt>Shipment amount</dt><dd>{shipmentAmount}</dd></div>}<div><dt>Latest location</dt><dd>{latestUpdate?.location || 'Location not updated'}</dd></div>{latestUpdate && <div><dt>Last updated</dt><dd>{formatTimestamp(latestUpdate.created_at)}</dd></div>}</dl></section>
          {result.package_image_url && <figure className="tracking-parcel-photo"><img src={result.package_image_url} alt={`Parcel for shipment ${result.tracking_number}`} /><figcaption>Parcel photo</figcaption></figure>}
          <section className="tracking-location-card"><h3>Location history &amp; map</h3><TrackingMap points={mapPoints}/>{result.history?.length ? <ol className="tracking-result-history">{result.history.map((item, index) => <li key={`${item.created_at}-${index}`}><i/><div><strong>{statusText(item.status)}</strong><span>{item.location || 'Location update'}</span>{item.note && <small>{item.note}</small>}</div><time>{formatTimestamp(item.created_at)}</time></li>)}</ol> : <p className="tracking-result-empty">No location updates have been posted yet.</p>}</section>
          <button type="button" className="tracking-another-button" onClick={trackAnotherItem}>Track another item</button>
        </section>}
      </div>
      <aside className="track-help"><div className="help-orbit"><CircleHelp size={28}/></div><span className="eyebrow eyebrow-green">NEED A HAND?</span><h3>We’re here to<br/><em>make it easy.</em></h3><p>Can’t find your tracking number? Reach out to the team that arranged your shipment.</p><a href="mailto:contact@swiftsurge.example">Contact SwiftSurge <ArrowRight size={16}/></a><div className="track-mini-route"><span><i/>COLLECTED</span><span className="mini-route-line"/><span><MapPin size={14}/> ON THE WAY</span></div></aside>
    </section>
    <section className="container track-steps"><div><span>01</span><PackageCheck/><h3>Enter your reference</h3><p>Use the number from your booking confirmation.</p></div><div><span>02</span><MapPin/><h3>See the latest update</h3><p>Follow important milestones on the journey.</p></div><div><span>03</span><CircleHelp/><h3>Ask us anytime</h3><p>Our team can help with the next step.</p></div></section>
  </div>;
}
