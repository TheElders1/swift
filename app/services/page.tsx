import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ClipboardCheck, Plane, Ship, Truck, Warehouse } from 'lucide-react';
import { CtaBand, PageHero, ServiceCards, TrackPanel } from '@/components/sections';

export const metadata: Metadata = { title: 'Shipping services' };
const details = [
  { icon: Plane, title: 'Air freight', desc: 'Reliable air cargo for urgent, high-value, and time-sensitive shipments. We help you navigate the details and stay informed from departure to arrival.', image: '/images/transnova/hero-air.jpg', points: ['Priority and economy options', 'Domestic and international reach', 'Clear milestone communication'] },
  { icon: Ship, title: 'Ocean freight', desc: 'Flexible sea freight for full and shared containers, planned around the way your business works.', image: '/images/transnova/hero-ocean.jpg', points: ['Full container and shared loads', 'Import and export coordination', 'Port-to-door planning'] },
  { icon: Truck, title: 'Road & courier', desc: 'Responsive parcel and road delivery that connects your business to customers and partners.', image: '/images/velorix/delivery-image.jpg', points: ['Door-to-door delivery', 'Flexible collection options', 'Careful last-mile handoff'] },
  { icon: Warehouse, title: 'Warehousing & distribution', desc: 'A dependable place for inventory and a practical route to the customers who need it.', image: '/images/velorix/service-image-2.jpg', points: ['Flexible storage', 'Order preparation', 'Distribution support'] },
];

export default function Services() {
  return <>
    <PageHero tag="OUR SERVICES" title={<>The right route.<br /><em>The right support.</em></>} desc="A flexible set of freight, courier, and supply chain services—connected by one thoughtful team." image="/images/velorix/service-image-3.jpg" />
    <section className="ss-section ss-services-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i />A SERVICE FOR EVERY MOVE</span><h2>Move confidently,<br /><em>at every scale.</em></h2></div><p>From an important parcel to ongoing freight, we bring the same care and clarity to every delivery.</p></div><ServiceCards /></div></section>
    <section className="ss-service-details"><div className="ss-container">{details.map(({ icon: Icon, title, desc, image, points }, index) => <article className={`ss-service-detail${index % 2 ? ' ss-service-detail-reverse' : ''}`} key={title}>
      <div className="ss-service-detail-image" style={{ backgroundImage: `linear-gradient(180deg, transparent 42%, rgba(9,31,51,.42)), url('${image}')` }}><span>0{index + 1}</span></div>
      <div className="ss-service-detail-copy"><span className="ss-eyebrow"><i />SWIFTSURGE SERVICES · 0{index + 1}</span><h2>{title}</h2><p>{desc}</p><ul>{points.map((point) => <li key={point}><ClipboardCheck size={16} />{point}</li>)}</ul><Link className="ss-text-link" href="/track">Track an existing shipment <ArrowUpRight size={15} /></Link></div>
    </article>)}</div></section>
    <section className="ss-section ss-track-section"><div className="ss-container"><TrackPanel /></div></section>
    <CtaBand />
  </>;
}
