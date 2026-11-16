import { SwiftSurgeMark } from '@/components/swiftsurge-brand';

export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="route-loading-card">
        <SwiftSurgeMark className="ss-loading-mark" />
        <strong>SwiftSurge Logistics</strong>
        <span>Preparing your shipment view…</span>
        <div className="route-loading-line" aria-hidden="true"><i /></div>
      </div>
    </div>
  );
}
