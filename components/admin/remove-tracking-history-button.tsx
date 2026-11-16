'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function RemoveTrackingHistoryButton({ shipmentId, historyId, isLatest }: { shipmentId: string; historyId: string; isLatest: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function removeEntry() {
    if (!window.confirm('Remove this location history entry? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    const supabase = createClient();
    let entryDeleted = false;

    try {
      const { error: deleteError } = await supabase
        .from('tracking_history')
        .delete()
        .eq('id', historyId)
        .eq('shipment_id', shipmentId);
      if (deleteError) throw deleteError;
      entryDeleted = true;

      if (isLatest) {
        const { data: previous, error: historyError } = await supabase
          .from('tracking_history')
          .select('status,lat,lng')
          .eq('shipment_id', shipmentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (historyError) throw historyError;

        const { error: shipmentError } = await supabase
          .from('shipments')
          .update({
            status: previous?.status ?? 'pending',
            current_lat: previous?.lat ?? null,
            current_lng: previous?.lng ?? null,
          })
          .eq('id', shipmentId);
        if (shipmentError) throw shipmentError;
      }

      router.refresh();
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Please try again.';
      setError(entryDeleted ? `Entry removed, but the shipment status could not be refreshed: ${detail}` : `Could not remove this location update: ${detail}`);
    } finally {
      setBusy(false);
    }
  }

  return <span className="shipment-history-remove-wrap">
    <button className="shipment-history-remove" type="button" onClick={removeEntry} disabled={busy} aria-label="Remove location history entry">
      <Trash2 size={13} /> {busy ? 'Removing…' : 'Remove'}
    </button>
    {error && <small className="shipment-history-remove-error" role="alert">{error}</small>}
  </span>;
}
