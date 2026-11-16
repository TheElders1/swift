import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Globe2, MapPin } from 'lucide-react';
import { CtaBand, PageHero, StatsStrip } from '@/components/sections';

export const metadata: Metadata = { title: 'Our global network' };
const hubs = [['West Africa', 'Regional hub network', 'Regional coordination, customs support, and local delivery expertise.'], ['Europe', 'London · Rotterdam · Frankfurt', 'Connected air, road, and ocean routes through key trade gateways.'], ['Middle East', 'Dubai · Doha · Riyadh', 'Responsive freight connections across a fast-moving trade region.'], ['Asia Pacific', 'Singapore · Hong Kong · Mumbai', 'Flexible routes linking manufacturers and markets across Asia.']];

export default function Locations() {
  return <>
    <PageHero tag="OUR NETWORK" title={<>Local knowledge.<br /><em>Global reach.</em></>} desc="A connected logistics network with people who understand the places—and the details—that keep freight moving." image="/images/transnova/locations.jpg" />
    <section className="ss-section ss-network-section"><div className="ss-container">
      <div className="ss-section-heading"><div><span className="ss-eyebrow"><i />WHERE WE CONNECT</span><h2>Many hubs.<br /><em>One team.</em></h2></div><p>SwiftSurge connects trusted regional partners, major gateways, and last-mile teams. You get the reach your plans need and a team to help navigate the details.</p></div>
      <div className="ss-network-map"><div className="ss-network-map-art"><div className="ss-map-grid"/><svg viewBox="0 0 800 370" aria-hidden="true"><path d="M90 236C171 102 237 274 332 175S487 115 552 205 667 274 725 90"/><path d="M90 236C191 314 273 297 373 255S558 224 725 90"/><circle cx="90" cy="236" r="8"/><circle cx="332" cy="175" r="7"/><circle cx="552" cy="205" r="7"/><circle cx="725" cy="90" r="9"/></svg>
        {[['West Africa','11%','64%'],['London','39%','46%'],['Dubai','67%','55%'],['Singapore','84%','24%']].map(([city, left, top]) => <span key={city} className="ss-network-pin" style={{ left, top }}><i/>{city}</span>)}
        <div className="ss-map-key"><Globe2/><span>Connected routes<br/><small>Local care at every handoff</small></span></div>
      </div><div className="ss-network-map-aside"><span className="ss-eyebrow ss-eyebrow-lime"><i/>A NETWORK THAT MOVES</span><h3>Closer to your<br />next destination.</h3><p>Our reach is built around reliable connections and people who care about getting the details right.</p><Link href="/about" className="ss-button ss-button-lime">Talk to our team <ArrowUpRight size={15}/></Link></div></div>
    </div></section>
    <section className="ss-section ss-hubs-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i/>REGIONAL EXPERTISE</span><h2>Connected by<br /><em>people who know.</em></h2></div><p>International capability works best when it’s paired with local understanding.</p></div><div className="ss-hub-grid">{hubs.map(([region, cities, desc], index) => <article key={region}><span className="ss-hub-index">0{index + 1}</span><MapPin size={19}/><span className="ss-eyebrow">REGIONAL HUB</span><h3>{region}</h3><strong>{cities}</strong><p>{desc}</p></article>)}</div></div></section>
    <div className="ss-container ss-stats-wrap"><StatsStrip /></div><CtaBand />
  </>;
}
