'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type ShipmentMenuProps = { id: string; trackingNumber: string };

export function ShipmentActionsMenu({ id, trackingNumber }: ShipmentMenuProps) {
  const router = useRouter();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function positionMenu() {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(210, window.innerWidth - 24);
    const estimatedHeight = 370;
    const top = rect.bottom + estimatedHeight < window.innerHeight
      ? rect.bottom + 6
      : Math.max(12, rect.top - estimatedHeight - 6);
    const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
    setStyle({ position: 'fixed', top, left, width, zIndex: 10000 });
  }

  useEffect(() => {
    if (!open) return;
    positionMenu();
    const dismiss = (event: PointerEvent) => {
      if (!trigger.current?.contains(event.target as Node) && !menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
    };
  }, [open]);

  const close = () => setOpen(false);
  async function moveToTrash() {
    if (!window.confirm(`Move shipment ${trackingNumber} to Trash? Public tracking will stop until you restore it.`)) return;
    setBusy(true);
    setError('');
    const { error: updateError } = await createClient().from('shipments').update({ deleted_at: new Date().toISOString() }).eq('id', id).is('deleted_at', null);
    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }
    close();
    router.refresh();
  }
  const menuContent = open && typeof document !== 'undefined' ? createPortal(
    <div ref={menu} className="shipment-action-menu shipment-action-menu-portal" style={style} role="menu" aria-label={`Actions for ${trackingNumber}`}>
      <Link role="menuitem" href={`/shipments/${id}`} onClick={close}>Shipment details</Link>
      <Link role="menuitem" href={`/shipments/${id}/edit`} onClick={close}>Edit shipment</Link>
      <Link role="menuitem" href={`/tracker/${trackingNumber}`} onClick={close}>Track shipment</Link>
      <Link role="menuitem" href={`/shipments/${id}#history`} onClick={close}>Location history</Link>
      <button role="menuitem" type="button" className="shipment-action-trash" onClick={() => void moveToTrash()} disabled={busy}><Trash2 size={13}/>{busy ? 'Moving to Trash…' : 'Delete · Move to Trash'}</button>
      {error && <span className="shipment-action-error" role="alert">{error}</span>}
      <span className="action-divider"/>
      <Link role="menuitem" href={`/shipments/${id}/pdf/1`} onClick={close}>PDF type 1 · Waybill</Link>
      <Link role="menuitem" href={`/shipments/${id}/pdf/2`} onClick={close}>PDF type 2 · Details</Link>
      <Link role="menuitem" href={`/shipments/${id}/pdf/3`} onClick={close}>PDF type 3 · Receipt</Link>
    </div>,
    document.body,
  ) : null;

  return <>
    <button ref={trigger} type="button" className="shipment-actions-trigger" aria-label={`Options for ${trackingNumber}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><MoreHorizontal size={18}/></button>
    {menuContent}
  </>;
}
