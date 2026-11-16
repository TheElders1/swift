const stampForStatus: Record<string, { label: string; color: string }> = {
  pending: { label: 'READY FOR DISPATCH', color: '#df6a22' },
  dispatched: { label: 'DISPATCHED', color: '#df6a22' },
  in_transit: { label: 'IN TRANSIT', color: '#0b6281' },
  out_for_delivery: { label: 'OUT FOR DELIVERY', color: '#df6a22' },
  delivered: { label: 'DELIVERED', color: '#078777' },
  delayed: { label: 'DELAYED', color: '#bd3e3e' },
  cancelled: { label: 'CANCELLED', color: '#5d6970' },
};

export function ShipmentStatusStamp({ status }: { status: string }) {
  const stamp = stampForStatus[status] ?? { label: status.replaceAll('_', ' ').toUpperCase(), color: '#0b326c' };

  return <svg className="shipment-pdf-stamp" viewBox="0 0 250 110" role="img" aria-label={`Shipment status: ${stamp.label}`} style={{ color: stamp.color }}>
    <g transform="rotate(-9 125 55)" fill="none" stroke="currentColor" strokeWidth="4">
      <ellipse cx="125" cy="55" rx="116" ry="43" strokeDasharray="7 3" />
      <ellipse cx="125" cy="55" rx="106" ry="34" />
      <path d="M42 73h166" strokeWidth="2" />
    </g>
    <text x="125" y="56" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize={stamp.label.length > 14 ? 16 : 22} fontWeight="900" letterSpacing="1.5" transform="rotate(-9 125 55)">{stamp.label}</text>
    <text x="125" y="78" textAnchor="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="700" letterSpacing="3" transform="rotate(-9 125 55)">SWIFTSURGE LOGISTICS</text>
  </svg>;
}
