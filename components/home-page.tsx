import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, CircleCheck, Globe2, MoveUpRight, PackageCheck, ScanEye, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { CtaBand, ServiceCards, StatsStrip, TrackPanel, TrustGrid } from './sections';

function RouteArtwork() {
  return <div className="ss-route-art" aria-label="Illustration of a shipment moving between global hubs">
    <div className="ss-route-topline"><span><i />NETWORK STATUS</span><strong>CONNECTED</strong></div>
    <div className="ss-route-map"><div className="ss-map-contours" /><svg viewBox="0 0 620 360" role="presentation" className="ss-route-svg">
      <path className="ss-route-path" d="M85 258 C167 213 174 110 282 126 S405 265 520 89" />
      <path className="ss-route-path-muted" d="M85 258 C176 294 246 266 320 231 S431 179 520 89" />
      <circle cx="85" cy="258" r="8" className="ss-route-node"/><circle cx="282" cy="126" r="7" className="ss-route-node ss-route-node-small"/><circle cx="520" cy="89" r="8" className="ss-route-node ss-route-node-lime"/>
      <g className="ss-route-plane" transform="translate(379 157) rotate(-16)"><path d="M0 13 50 0 32 17l9 12-14-7-12 11 4-16z" fill="currentColor"/></g>
    </svg>
    <span className="ss-map-label ss-label-origin">ORIGIN HUB <strong>Lagos</strong></span><span className="ss-map-label ss-label-middle">IN TRANSIT</span><span className="ss-map-label ss-label-destination">ARRIVAL HUB <strong>Toronto</strong></span>
    <div className="ss-route-package"><span className="ss-package-icon"><PackageCheck size={17}/></span><span><small>SHIPMENT STATUS</small><strong>Moving with care</strong></span><i /></div>
    </div>
    <div className="ss-route-footer"><span><Globe2 size={14}/> Global reach</span><span>Updates along the way <ArrowUpRight size={13}/></span></div>
  </div>;
}

export function HomePage() {
  return <>
    <section className="ss-hero"><div className="ss-hero-orb"/><div className="ss-container ss-hero-grid">
      <div className="ss-hero-copy"><span className="ss-eyebrow ss-eyebrow-dark"><i/>LOGISTICS WITH MOMENTUM</span><h1>Make your next move <em>count.</em></h1><p>Freight, courier, and supply chain support that keeps your business moving with clarity at every handoff.</p><div className="ss-hero-actions"><Link className="ss-button ss-button-blue" href="/services">Explore services <ArrowUpRight size={16}/></Link><Link className="ss-button ss-button-quiet" href="/about">Meet SwiftSurge <MoveUpRight size={16}/></Link></div><div className="ss-hero-assurance"><span><CircleCheck size={15}/>Clear shipment updates</span><span><CircleCheck size={15}/>Personal support</span></div></div>
      <RouteArtwork />
    </div><div className="ss-container ss-hero-bottom"><span>DESIGNED FOR THE JOURNEY AHEAD</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></div></section>
    <div className="ss-container ss-track-float"><TrackPanel compact /></div>
    <section className="ss-section ss-services-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i/>HOW WE MOVE</span><h2>One network.<br/><em>More ways forward.</em></h2></div><div><p>From a single parcel to a multi-stop freight plan, the right service begins with understanding what matters to you.</p><Link href="/services" className="ss-text-link">View all services <ArrowRight size={15}/></Link></div></div><ServiceCards /></div></section>
    <section className="ss-dark-section"><div className="ss-container"><div className="ss-section-heading ss-heading-light"><div><span className="ss-eyebrow ss-eyebrow-lime"><i/>WHY SWIFTSURGE</span><h2>Clear plans.<br/><em>Better journeys.</em></h2></div><div><p>We bring the route, the people, and the shipment details together—so every next step feels easier to see.</p><Link href="/why-us" className="ss-text-link ss-text-link-light">Our approach <ArrowRight size={15}/></Link></div></div><TrustGrid/><StatsStrip /></div></section>
    <section className="ss-section ss-process-section"><div className="ss-container ss-process-layout"><div className="ss-process-intro"><span className="ss-eyebrow"><i/>FROM PICKUP TO ARRIVAL</span><h2>Progress you<br/>can <em>follow.</em></h2><p>Logistics doesn’t have to feel like a black box. We keep the essentials clear, the communication open, and the next milestone in view.</p><Link className="ss-button ss-button-outline-dark" href="/track">Track a shipment <ArrowUpRight size={15}/></Link></div><div className="ss-process-list"><article><span>01</span><div><h3>Plan the move</h3><p>Tell us what you’re shipping and where it needs to go.</p></div><BadgeCheck/></article><article><span>02</span><div><h3>We coordinate</h3><p>Your route and handoffs are organized around your priorities.</p></div><Truck/></article><article><span>03</span><div><h3>Stay in the loop</h3><p>Follow status updates and get help from a real person.</p></div><ScanEye/></article></div></div></section>
    <section className="ss-network-band"><div className="ss-container ss-network-inner"><div className="ss-network-icon"><Sparkles size={23}/></div><div><span className="ss-eyebrow ss-eyebrow-lime"><i/>THE SWIFTSURGE PROMISE</span><h2>Momentum, with<br/>a human touch.</h2><p>Global capability and personal attention can travel together. That’s how we make every delivery feel considered.</p></div><Link href="/about" className="ss-button ss-button-lime">Get to know us <ArrowUpRight size={16}/></Link></div></section>
    <CtaBand />
  </>;
}
