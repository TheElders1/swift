export function SwiftSurgeMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" aria-hidden="true">
      <rect x="1" y="1" width="54" height="54" rx="17" fill="currentColor" />
      <path d="M40 14H25c-7 0-12 5-12 12v2h14c3 0 4 3 2 5L17 46c-2 2-1 5 2 5h13c7 0 12-5 12-12v-2H29c-3 0-4-3-2-5l13-13c2-2 1-5-2-5Z" fill="#fff" transform="translate(1 -4) scale(.92)" />
      <path d="M13 17H4l-4 5h10zm-4 12H-3l-4 5h13z" fill="var(--surge-lime, #b8e82f)" transform="translate(8 8)" />
    </svg>
  );
}

export function SwiftSurgeWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`ss-brand-lockup${light ? ' ss-brand-light' : ''}`}>
      <SwiftSurgeMark className="ss-brand-mark" />
      <span className="ss-brand-name">SwiftSurge<span className="ss-brand-dot">.</span><small>LOGISTICS</small></span>
    </span>
  );
}
