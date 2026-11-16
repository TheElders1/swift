import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, HeartHandshake, Route, Sparkles } from 'lucide-react';
import { CtaBand, PageHero, StatsStrip, TrustGrid } from '@/components/sections';

export const metadata: Metadata = { title: 'About SwiftSurge' };

export default function About() {
  return <>
    <PageHero tag="ABOUT SWIFTSURGE" title={<>Good people.<br /><em>Better movement.</em></>} desc="We believe thoughtful logistics starts with listening, clear planning, and care at every handoff." image="/images/velorix/hero-landing-bg.jpg" />
    <section className="ss-section ss-story-section"><div className="ss-container ss-about-story">
      <div className="ss-about-photo"><div className="ss-about-photo-image" /><span className="ss-about-photo-note"><small>OUR POINT OF VIEW</small><strong>Every delivery<br />has a person<br />behind it.</strong></span></div>
      <div className="ss-about-copy"><span className="ss-eyebrow"><i />THE SWIFTSURGE STORY</span><h2>Built around<br /><em>what matters.</em></h2><p>SwiftSurge was created for businesses that want a logistics partner, not just another tracking number. Our team brings practical experience, a connected network, and personal attention to each shipment.</p><p>From the first conversation to the final handoff, we keep the next step clear—so you can focus on what you do best.</p><Link className="ss-text-link" href="/services">Explore how we help <ArrowUpRight size={16} /></Link></div>
    </div></section>
    <section className="ss-section ss-values-section"><div className="ss-container"><div className="ss-section-heading"><div><span className="ss-eyebrow"><i />OUR VALUES, IN MOTION</span><h2>What you can<br /><em>count on.</em></h2></div><p>Strong logistics is built from consistent details: good communication, careful handling, and people who stay accountable.</p></div><TrustGrid /><div className="ss-value-grid"><article><span><HeartHandshake /></span><h3>Care in every connection</h3><p>We listen, communicate clearly, and treat each shipment as a promise to your customer.</p></article><article><span><Route /></span><h3>Thoughtful by design</h3><p>We find the right route and service to fit your priorities, not a one-size-fits-all playbook.</p></article><article><span><Sparkles /></span><h3>Always getting better</h3><p>We keep improving the details that make shipping feel simpler and more dependable.</p></article></div></div></section>
    <div className="ss-container ss-stats-wrap"><StatsStrip /></div>
    <CtaBand />
  </>;
}
