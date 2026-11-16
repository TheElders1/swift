import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import './admin-workspace.css';
import './motion.css';
import './swiftsurge-design.css';
import { RootChrome } from '@/components/root-chrome';
import { ChatwayWidget } from '@/components/chatway-widget';

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const configuredIsPlaceholder = configuredUrl?.includes('your-domain.com')
    || configuredUrl?.includes('yourdomain.com');
  // Use the configured canonical domain when present; otherwise use Vercel's
  // deployment hostname until the customer provides a permanent domain.
  const candidate = configuredUrl && !configuredIsPlaceholder
    ? configuredUrl
    : vercelHost
      ? `https://${vercelHost}`
      : 'http://localhost:3000';

  try {
    return new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
  } catch {
    return new URL('http://localhost:3000');
  }
}

const siteUrl = resolveSiteUrl();
const socialImage = new URL('/images/swiftsurge-logistics-social.png?v=2', siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  alternates: { canonical: '/' },
  title: { default: 'SwiftSurge Logistics | Freight, delivered with clarity', template: '%s | SwiftSurge Logistics' },
  description: 'Reliable international freight, courier and supply chain services, with shipment updates you can follow.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    url: '/',
    title: 'SwiftSurge Logistics | Momentum behind every delivery.',
    description: 'Reliable international freight, courier and supply chain services, with shipment updates you can follow.',
    siteName: 'SwiftSurge Logistics',
    type: 'website',
    images: [{ url: socialImage, width: 1200, height: 630, type: 'image/png', alt: 'SwiftSurge Logistics — Momentum behind every delivery.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwiftSurge Logistics | Momentum behind every delivery.',
    description: 'Reliable international freight, courier and supply chain services, with shipment updates you can follow.',
    images: [{ url: socialImage, alt: 'SwiftSurge Logistics — Momentum behind every delivery.' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><RootChrome>{children}</RootChrome><ChatwayWidget /></body></html>;
}
