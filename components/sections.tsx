import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Box, Clock3, Globe2, Headset, PackageCheck, Plane, Ship, ShieldCheck, Truck, Warehouse } from 'lucide-react';
import { AnimatedNumber } from '@/components/animated-number';

export function PageHero({ tag, title, desc, image = '/images/transnova/about.jpg' }: { tag: string; title: ReactNode; desc: string; image?: string }) {
  return <section className="ss-page-hero" style={{ '--page-hero-image': `url('${image}')` } as CSSProperties}>
    <div className="ss-page-hero-shade" />
    <div className="ss-container ss-page-hero-inner"><span className="ss-eyebrow"><i />{tag}</span><h1>{title}</h1><p>{desc}</p></div>
    <div className="ss-page-hero-index">SWIFTSURGE <span>/</span> LOGISTICS</div>
  </section>;
}

export function TrackPanel({ compact = false }: { compact?: boolean }) {
  return <section className={`ss-track-card${compact ? ' ss-track-card-compact' : ''}`}>
    <div className="ss-track-copy"><span className="ss-eyebrow"><i />SHIPMENT VISIBILITY</span><h2>Know where<br />your cargo <em>is.</em></h2><p>Follow every milestone and see what happens next, from pickup to delivery.</p><div className="ss-track-proof"><span><ShieldCheck size={15} />Secure shipment lookup</span><span><Clock3 size={15} />Milestone updates</span></div></div>
    <form className="ss-track-form" action="/track"><label htmlFor="tracking-number">Enter your tracking number</label><div><Box size={18} /><input id="tracking-number" name="id" placeholder="e.g. SS-2048-1190" required /><button aria-label="Find shipment"><ArrowRight size={19} /></button></div><small>Your tracking reference is in your dispatch confirmation.</small></form>
  </section>;
}

const services = [
  { icon: Plane, number: '01', title: 'Air freight', text: 'Time-sensitive cargo, thoughtfully routed across borders.', image: '/images/transnova/hero-air.jpg', tag: 'WHEN TIME MATTERS' },
  { icon: Ship, number: '02', title: 'Ocean freight', text: 'Flexible container capacity for the bigger picture.', image: '/images/transnova/hero-ocean.jpg', tag: 'ROOM TO MOVE' },
  { icon: Truck, number: '03', title: 'Road & courier', text: 'Reliable door-to-door delivery for every last mile.', image: '/images/velorix/delivery-image.jpg', tag: 'CLOSE TO HOME' },
  { icon: Warehouse, number: '04', title: 'Warehousing', text: 'Storage and distribution that keep your business ready.', image: '/images/velorix/service-image-1.jpg', tag: 'READY WHEN YOU ARE' },
];

export function ServiceCards() {
  return <div className="ss-service-grid">{services.map(({ icon: Icon, number, title, text, image, tag }) => <article className="ss-service-card" key={title}>
    <div className="ss-service-picture" style={{ backgroundImage: `linear-gradient(180deg, transparent 32%, rgba(7,25,42,.72)), url('${image}')` }}><span>{number}</span><Icon size={22} /></div>
    <div className="ss-service-content"><span className="ss-service-tag">{tag}</span><h3>{title}</h3><p>{text}</p><Link href="/services" aria-label={`Explore ${title}`}><ArrowUpRight size={17} /></Link></div>
  </article>)}</div>;
}

export function StatsStrip() {
  return <div className="ss-stats-strip"><div><strong><AnimatedNumber value={24} suffix="/7" /></strong><span>Shipment visibility</span></div><div><strong><AnimatedNumber value={120} suffix="+" /></strong><span>Countries connected</span></div><div><strong><AnimatedNumber value={98} suffix="%" /></strong><span>On-time delivery goal</span></div><div><strong><AnimatedNumber value={1} suffix=" team" /></strong><span>With you at every step</span></div></div>;
}

export function TrustGrid() {
  const items = [
    { icon: Globe2, title: 'Connected worldwide', text: 'A broad network links local knowledge with global reach.' },
    { icon: PackageCheck, title: 'Clarity at every step', text: 'Straightforward updates keep you close to your shipment.' },
    { icon: Headset, title: 'People who pick up', text: 'Real support from a team that understands your priorities.' },
  ];
  return <div className="ss-trust-grid">{items.map(({ icon: Icon, title, text }) => <article key={title}><span className="ss-trust-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

export function CtaBand() {
  return <section className="ss-cta-band"><div className="ss-container ss-cta-inner"><div><span className="ss-eyebrow"><i />READY FOR THE NEXT MOVE</span><h2>Let’s make it<br /><em>happen.</em></h2></div><Link className="ss-button ss-button-lime" href="/about">Talk to our team <ArrowUpRight size={17} /></Link></div></section>;
}
