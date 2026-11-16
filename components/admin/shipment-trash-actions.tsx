'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function ShipmentTrashActions({ id, trackingNumber, imageUrl }: { id: string; trackingNumber: string; imageUrl: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function restore() {
    setBusy(true);
    setError('');
    const { error: restoreError } = await createClient().from('shipments').update({ deleted_at: null }).eq('id', id);
    if (restoreError) {
      setError(restoreError.message);
      setBusy(false);
      return;
    }
    router.refresh();
  }

  async function permanentlyDelete() {
    if (!window.confirm(`Permanently delete shipment ${trackingNumber} and its tracking history? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    const supabase = createClient();

    if (imageUrl && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const image = new URL(imageUrl);
        const project = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
        const bucketPath = '/storage/v1/object/public/shipment-images/';
        if (image.origin === project.origin && image.pathname.includes(bucketPath)) {
          const objectPath = decodeURIComponent(image.pathname.split(bucketPath)[1]);
          const { error: storageError } = await supabase.storage.from('shipment-images').remove([objectPath]);
          if (storageError) throw new Error(`Could not remove the parcel photo: ${storageError.message}`);
        }
      } catch (storageFailure) {
        setError(storageFailure instanceof Error ? storageFailure.message : 'Could not remove the parcel photo.');
        setBusy(false);
        return;
      }
    }

    const { error: deleteError } = await supabase.from('shipments').delete().eq('id', id).not('deleted_at', 'is', null);
    if (deleteError) {
      setError(deleteError.message);
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return <div className="shipment-trash-actions">
    <button type="button" onClick={() => void restore()} disabled={busy}><RotateCcw size={14}/>{busy ? 'Working…' : 'Restore'}</button>
    <button type="button" className="is-danger" onClick={() => void permanentlyDelete()} disabled={busy}><Trash2 size={14}/>Delete permanently</button>
    {error && <span role="alert">{error}</span>}
  </div>;
}
