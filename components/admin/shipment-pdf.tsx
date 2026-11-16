import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, Package, Weight, CalendarDays } from 'lucide-react';
import { PrintButton } from '@/components/admin/print-button';
import { ShipmentStatusStamp } from '@/components/admin/shipment-status-stamp';
import type { ReactNode } from 'react';
import { formatCurrency } from '@/utils/format-currency';

export type ShipmentDocument = {
  id: string;
  tracking_number: string;
  sender_name: string | null;
  sender_address: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  receiver_name: string | null;
  receiver_address: string | null;
  receiver_email: string | null;
  receiver_phone: string | null;
  origin: string | null;
  destination: string | null;
  description: string | null;
  shipment_comments: string | null;
  status: string;
  estimated_delivery: string | null;
  shipment_date: string | null;
  weight_kg: number | null;
  package_type: string | null;
  package_image_url: string | null;
  shipment_amount: number | null;
  currency: string | null;
  shipment_currency: string | null;
  created_at: string;
};

const value = (input: string | number | null | undefined) => input === null || input === undefined || input === '' ? '—' : String(input);
const date = (input: string | null) => {
  if (!input) return '—';
  const parsed = new Date(`${input.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed);
};
const statusLabel = (input: string) => input.replaceAll('_', ' ').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const CONTACT_EMAIL = 'contact@swiftsurge.example';
const CONTACT_PHONE = 'Contact support for current service numbers';
const CONTACT_ADDRESS = 'Regional service network';

function Brand({ kind }: { kind: string }) {
  return <header className={`shipment-pdf-brand shipment-pdf-brand-${kind}`}>
    <img src="/images/swiftsurge-logistics-logo.png" alt="SwiftSurge Logistics" />
    <div><strong>SWIFTSURGE LOGISTICS</strong><span>MOMENTUM BEHIND EVERY DELIVERY</span></div>
  </header>;
}

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <div className={`shipment-pdf-field ${className}`}><span>{label}</span><strong>{children}</strong></div>;
}

function ContactPanel() {
  return <aside className="shipment-pdf-contact">
    <h2>Contact SwiftSurge</h2>
    <p><MapPin aria-hidden="true" /> <span>{CONTACT_ADDRESS}</span></p>
    <p><Mail aria-hidden="true" /> <span>Email: {CONTACT_EMAIL}</span></p>
    <p><Phone aria-hidden="true" /> <span>{CONTACT_PHONE}</span></p>
  </aside>;
}

function PersonCard({ kind, name, address, email, phone }: { kind: string; name: string | null; address: string | null; email?: string | null; phone: string | null }) {
  return <section className="shipment-pdf-person">
    <h2>{kind}: {value(name)}</h2>
    <p><span>Address</span>{value(address)}</p>
    {email !== undefined && <p><span>Email</span>{value(email)}</p>}
    <p><span>Phone</span>{value(phone)}</p>
  </section>;
}

export function ShipmentPdf({ shipment, type }: { shipment: ShipmentDocument; type: string }) {
  const variant = type === '2' ? 'details' : type === '3' ? 'receipt' : 'waybill';
  const amount = formatCurrency(shipment.shipment_amount, shipment.currency || shipment.shipment_currency);
  const sentDate = date(shipment.shipment_date);
  const deliveryDate = date(shipment.estimated_delivery);
  const progressForStatus: Record<string, number> = { pending: 8, collected: 18, dispatched: 28, in_transit: 55, out_for_delivery: 82, delivered: 100 };
  const progress = progressForStatus[shipment.status.toLowerCase().replaceAll('-', '_')] ?? 42;

  return <div className={`shipment-pdf-shell shipment-pdf-${variant}`}>
    <header className="shipment-pdf-toolbar"><Link href="/shipments"><ArrowLeft size={16} /> Back to shipments</Link><PrintButton /></header>
    <article className="shipment-pdf-paper">
      <Brand kind={variant} />

      {variant === 'waybill' && <>
        <div className="shipment-pdf-waybill-top">
          <div><span>CONSIGNMENT WAYBILL</span><strong>{shipment.tracking_number}</strong><small>Origin: {value(shipment.origin)}　·　Destination: {value(shipment.destination)}</small></div>
          <ShipmentStatusStamp status={shipment.status} />
        </div>
        <div className="shipment-pdf-waybill-grid">
          <section className="shipment-pdf-form-block shipment-pdf-waybill-sender"><h2>1. Sender</h2><Field label="SENDER NAME">{value(shipment.sender_name)}</Field><Field label="SENDER ADDRESS">{value(shipment.sender_address)}</Field><Field label="PHONE / EMAIL">{value(shipment.sender_phone)}　·　{value(shipment.sender_email)}</Field></section>
          <section className="shipment-pdf-form-block shipment-pdf-waybill-destination"><h2>2. Destination / consignee</h2><Field label="RECEIVER NAME">{value(shipment.receiver_name)}</Field><Field label="DELIVERY ADDRESS">{value(shipment.receiver_address)}</Field><Field label="PHONE / EMAIL">{value(shipment.receiver_phone)}　·　{value(shipment.receiver_email)}</Field></section>
          <section className="shipment-pdf-form-block shipment-pdf-waybill-parcel"><h2>3. Parcel information</h2><Field label="CONTENTS / DESCRIPTION">{value(shipment.description || shipment.package_type)}</Field><Field label="PACKAGE TYPE">{value(shipment.package_type)}</Field><Field label="WEIGHT">{shipment.weight_kg == null ? '—' : `${shipment.weight_kg} kg`}</Field></section>
          <section className="shipment-pdf-form-block shipment-pdf-waybill-dates"><h2>4. Shipment schedule</h2><Field label="DISPATCH DATE">{sentDate}</Field><Field label="EXPECTED DELIVERY">{deliveryDate}</Field><Field label="CURRENT STATUS">{statusLabel(shipment.status)}</Field></section>
          <section className="shipment-pdf-form-block shipment-pdf-waybill-charges"><h2>5. Charges and reference</h2><Field label="SHIPMENT CHARGES">{amount}</Field><Field label="SHIPMENT REFERENCE">{shipment.tracking_number}</Field><Field label="COMMENTS">{value(shipment.shipment_comments)}</Field></section>
          <section className="shipment-pdf-form-block shipment-pdf-waybill-sign"><h2>6. Dispatch note and receipt</h2><p>Prepared by SwiftSurge Logistics</p><div className="shipment-pdf-default-signature"><span>Authorized representative · SwiftSurge Logistics</span><i /></div><div>Received by / date <i /></div></section>
        </div>
        <footer className="shipment-pdf-waybill-footer"><span>Keep this waybill with the shipment record.</span><ContactPanel /></footer>
      </>}

      {variant === 'details' && <>
        <div className="shipment-pdf-detail-heading"><span>SHIPMENT DETAILS</span><strong>{shipment.tracking_number}</strong></div>
        <div className="shipment-pdf-detail-summary"><div><span>STATUS</span><strong>{statusLabel(shipment.status)}</strong></div><div><span>RECEIVED / DISPATCHED</span><strong>{sentDate}</strong></div><div><span>EXPECTED DELIVERY</span><strong>{deliveryDate}</strong></div><div className="shipment-pdf-detail-progress"><i style={{ width: `${progress}%` }} /></div></div>
        {shipment.package_image_url ? <figure className="shipment-pdf-parcel-image"><img src={shipment.package_image_url} alt={`Parcel for shipment ${shipment.tracking_number}`} /><figcaption><Package size={14} /> Parcel photo · {value(shipment.package_type)}</figcaption></figure> : <div className="shipment-pdf-parcel-placeholder"><Package /><span>Parcel photo was not provided for this shipment</span></div>}
        <div className="shipment-pdf-people-grid"><PersonCard kind="From" name={shipment.sender_name} address={shipment.sender_address} email={shipment.sender_email} phone={shipment.sender_phone} /><PersonCard kind="To" name={shipment.receiver_name} address={shipment.receiver_address} email={shipment.receiver_email} phone={shipment.receiver_phone} /></div>
        <section className="shipment-pdf-detail-table"><h2>Shipment information</h2><Field label="TRACKING ID">{shipment.tracking_number}</Field><Field label="DESCRIPTION">{value(shipment.description || shipment.package_type)}</Field><Field label="STATUS">{statusLabel(shipment.status)}</Field><Field label="SHIPPED FROM">{value(shipment.origin)}</Field><Field label="SHIPPED TO">{value(shipment.destination)}</Field><Field label="EXPECTED DELIVERY">{deliveryDate}</Field><Field label="DATE OF SHIPMENT">{sentDate}</Field><Field label="WEIGHT">{shipment.weight_kg == null ? '—' : <><Weight size={13} /> {shipment.weight_kg} kg</>}</Field><Field label="SHIPMENT CHARGES">{amount}</Field><Field label="SHIPMENT COMMENTS">{value(shipment.shipment_comments)}</Field></section>
        <ContactPanel />
        <div className="shipment-pdf-default-signature shipment-pdf-details-signature"><span>Authorized representative · SwiftSurge Logistics</span><i /></div>
      </>}

      {variant === 'receipt' && <>
        <div className="shipment-pdf-receipt-title"><div><span>SHIPMENT RECEIPT</span><strong>Tracking ID: {shipment.tracking_number}</strong></div><ShipmentStatusStamp status={shipment.status} /></div>
        <div className="shipment-pdf-receipt-date"><CalendarDays size={15} /> Date of shipment: <strong>{sentDate}</strong></div>
        <PersonCard kind="Sender" name={shipment.sender_name} address={shipment.sender_address} email={shipment.sender_email} phone={shipment.sender_phone} />
        <PersonCard kind="Receiver" name={shipment.receiver_name} address={shipment.receiver_address} email={shipment.receiver_email} phone={shipment.receiver_phone} />
        <div className="shipment-pdf-receipt-route"><span>DESTINATION</span><strong>{value(shipment.destination)}</strong></div>
        <section className="shipment-pdf-receipt-description"><h2>Parcel description</h2><p>{value(shipment.description || shipment.package_type)}</p>{shipment.package_type && <small>Package type: {shipment.package_type}</small>}</section>
        <div className="shipment-pdf-receipt-facts"><Field label="EXPECTED DATE OF DELIVERY">{deliveryDate}</Field><Field label="WEIGHT">{shipment.weight_kg == null ? '—' : `${shipment.weight_kg} kg`}</Field><Field label="STATUS">{statusLabel(shipment.status)}</Field><Field label="SHIPMENT CHARGES">{amount}</Field><Field label="COMMENTS">{value(shipment.shipment_comments)}</Field></div>
        <ContactPanel />
        <p className="shipment-pdf-terms">Please retain this receipt for your shipment records. For help with this delivery, contact SwiftSurge Logistics using the details above.</p>
        <div className="shipment-pdf-receipt-signature"><span className="shipment-pdf-receipt-company-signature"><small>SwiftSurge Logistics · Authorized representative</small></span><span>Recipient signature __________________________</span></div>
      </>}
      <footer className="shipment-pdf-footer"><span>SwiftSurge Logistics · Momentum behind every delivery.</span><span>Generated {date(new Date().toISOString())}</span></footer>
    </article>
  </div>;
}
