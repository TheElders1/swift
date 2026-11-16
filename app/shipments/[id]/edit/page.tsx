import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditShipmentForm } from '@/components/admin/edit-shipment-form';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = { title: 'Edit shipment · Operations' };

export default async function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: shipment, error }, { data: latestHistory }] = await Promise.all([
    supabase.from('shipments').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
    supabase.from('tracking_history').select('location').eq('shipment_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (error || !shipment) notFound();
  return <main className="admin-page"><div className="admin-main"><div className="admin-content admin-create-content"><EditShipmentForm shipment={shipment} currentLocation={latestHistory?.location} /></div></div></main>;
}
