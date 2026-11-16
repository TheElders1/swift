'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

const CHATWAY_SRC = 'https://cdn.chatway.app/widget.js?id=Ggf0G9VYUzy4';

function isAdminPath(path: string) {
  return path === '/admin'
    || path.startsWith('/admin/')
    || path === '/shipments'
    || path.startsWith('/shipments/')
    || path.startsWith('/index.php/admin/')
    || path === '/login'
    || path === '/login.html';
}

function removeChatway() {
  // Remove the loader, iframe, launcher, and labelled roots injected by Chatway.
  // The messenger can be injected again by an already-running script, so the
  // restricted routes also observe and remove any late additions.
  document.querySelectorAll<HTMLElement>([
    'script[src*="chatway" i]',
    'script[src*="shopify" i]',
    'iframe[src*="chatway" i]',
    'iframe[src*="shopify" i]',
    'iframe[title*="chat" i]',
    'iframe[title*="messenger" i]',
    'iframe[title*="shopify" i]',
    '[id*="chatway" i]',
    '[class*="chatway" i]',
    '[id*="shopify" i]',
    '[class*="shopify" i]',
    '[id*="messenger" i]',
    '[class*="messenger" i]',
    '[aria-label*="chat" i]',
    '[aria-label*="messenger" i]',
    '[title*="chatway" i]',
  ].join(',')).forEach((element) => element.remove());
}

export function ChatwayWidget() {
  const pathname = usePathname() || '/';

  useLayoutEffect(() => {
    if (isAdminPath(pathname)) {
      document.documentElement.setAttribute('data-chatway-disabled', 'true');
      removeChatway();
      const observer = new MutationObserver(removeChatway);
      observer.observe(document.documentElement, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    document.documentElement.removeAttribute('data-chatway-disabled');

    if (document.querySelector(`script[src="${CHATWAY_SRC}"]`)) return;

    const script = document.createElement('script');
    script.id = 'chatway';
    script.async = true;
    script.src = CHATWAY_SRC;
    document.body.appendChild(script);

    return () => {
      // On navigation to admin, the next layout effect removes injected UI too.
      script.remove();
    };
  }, [pathname]);

  return null;
}
