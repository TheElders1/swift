'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';

export function RootChrome({ children }: { children: ReactNode }) {
  const path = usePathname();
  const immersive = path === '/admin' || path.startsWith('/admin/') || path === '/shipments' || path.startsWith('/shipments/') || path.startsWith('/index.php/admin/') || path === '/login' || path === '/login.html';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-enabled');
    const main = document.querySelector('main');
    if (!main) return;

    const revealSelector = [
      '.hero', '.page-hero', '.track-wrap', 'main > .section',
      '.track-page-content', '.service-detail',
      '.service-card', '.reason-grid article', '.value-cards article',
      '.process-grid > div', '.hub-grid article', '.promise-grid > div',
      '.track-steps > div', '.stats-strip > div', '.about-intro > div',
      '.about-photo', '.center-heading', '.trust-grid > div',
      '.section-heading > *', '.process-heading', '.story-photo',
      '.story-copy', '.cta-inner',
      '.ss-hero-copy', '.ss-route-art', '.ss-track-card',
      '.ss-section-heading', '.ss-service-card', '.ss-trust-grid article',
      '.ss-process-list article', '.ss-page-hero-inner', '.ss-about-photo',
      '.ss-reasons-grid article', '.ss-hub-grid article', '.ss-network-map',
      '.ss-promise-copy', '.ss-assurance-grid article',
    ].join(',');
    const targets = Array.from(main.querySelectorAll<HTMLElement>(revealSelector));
    main.querySelectorAll<HTMLElement>('.about-intro > div:first-child, .story-photo, .section-heading > :first-child')
      .forEach((element) => element.classList.add('motion-from-left'));
    main.querySelectorAll<HTMLElement>('.about-intro > div:last-child, .story-copy, .section-heading > :last-child')
      .forEach((element) => element.classList.add('motion-from-right'));
    main.querySelectorAll<HTMLElement>('.about-photo, .ss-about-photo, .ss-network-map')
      .forEach((element) => element.classList.add('motion-zoom'));

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 90px 0px' });

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);

  return <>
    {!immersive && <SiteHeader />}
    {immersive ? children : <main>{children}</main>}
    {!immersive && <SiteFooter />}
  </>;
}
