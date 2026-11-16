import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShipmentPdf, type ShipmentDocument } from '@/components/admin/shipment-pdf';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ id: string; type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const names: Record<string, string> = { '1': 'Shipment waybill', '2': 'Shipment details', '3': 'Shipment receipt' };
  return { title: names[type] || 'Shipment document' };
}

export default async function ShipmentPdfPage({ params }: { params: Promise<{ id: string; type: string }> }) {
  const { id, type } = await params;
  if (!['1', '2', '3'].includes(type)) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase.from('shipments').select('*').eq('id', id).is('deleted_at', null).maybeSingle();
  if (error || !data) notFound();

  return <ShipmentPdf shipment={data as ShipmentDocument} type={type} />;
}
