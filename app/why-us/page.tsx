import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Clock3, HeartHandshake, MessagesSquare, ScanEye, ShieldCheck, Sparkles } from 'lucide-react';
import { CtaBand, PageHero, StatsStrip, TrackPanel } from '@/components/sections';

export const metadata: Metadata = { title: 'Why SwiftSurge' };
const reasons = [
  { icon: HeartHandshake, title: 'A personal point of contact', text: 'Get a team that knows your shipment, understands your priorities, and is ready to help.' },
  { icon: ScanEye, title: 'Visibility that makes sense', text: 'Updates are clear and useful, so you know where things stand and what comes next.' },
  { icon: BadgeCheck, title: 'Dependable by default', text: 'Careful handoffs, considered routes, and a team committed to doing the details well.' },
  { icon: Sparkles, title: 'Flexible when plans change', text: 'Real people work with you to respond to changing needs and find a good path forward.' },
];

export default function WhyUs() {
  return <>
    <PageHero tag="THE SWIFTSURGE DIFFERENCE" title={<>Good service.<br /><em>Good people.</em></>} desc="When your shipment matters, who’s behind it matters too. Here’s how we make logistics feel more human." image="/images/velorix/support-image.jpg" />
    <section className="ss-section ss-why-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i/>A PARTNER, NOT JUST A PROVIDER</span><h2>Care through<br /><em>the whole journey.</em></h2></div><p>SwiftSurge combines a capable network with personal service. We make your priorities part of the plan, keep you informed, and stay accountable all the way to delivery.</p></div>
      <div className="ss-reasons-grid">{reasons.map(({ icon: Icon, title, text }, index) => <article key={title}><span className="ss-reason-index">0{index + 1}</span><span className="ss-reason-icon"><Icon size={20}/></span><h3>{title}</h3><p>{text}</p><i className="ss-reason-rule"/></article>)}</div>
    </div></section>
    <section className="ss-promise-section"><div className="ss-container ss-promise-grid"><div className="ss-promise-visual"><div className="ss-promise-orbit orbit-one"/><div className="ss-promise-orbit orbit-two"/><span><ShieldCheck size={31}/></span><small>EVERY HANDOFF MATTERS</small></div><div className="ss-promise-copy"><span className="ss-eyebrow ss-eyebrow-lime"><i/>THE SWIFTSURGE PROMISE</span><h2>Make every move<br />feel <em>well handled.</em></h2><p>We don’t take your trust for granted. Every conversation, update, and handoff is another chance to show you your business is in good hands.</p><Link href="/about" className="ss-text-link ss-text-link-light">Learn about our approach <ArrowUpRight size={15}/></Link></div></div></section>
    <section className="ss-section ss-assurance-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i/>THE DETAILS THAT MATTER</span><h2>Confidence at<br /><em>every step.</em></h2></div><p>Dependable service comes from small, repeated choices that help protect your shipment and your time.</p></div><div className="ss-assurance-grid"><article><ShieldCheck/><h3>Carefully handled</h3><p>Thoughtful processes help protect your shipment at each handoff.</p></article><article><Clock3/><h3>Clear on timing</h3><p>Useful updates help you plan what comes next.</p></article><article><MessagesSquare/><h3>Easy to reach</h3><p>Helpful people are ready to answer your questions.</p></article></div></div></section>
    <section className="ss-section ss-track-section"><div className="ss-container"><TrackPanel/></div></section><div className="ss-container ss-stats-wrap"><StatsStrip/></div><CtaBand/>
  </>;
}
