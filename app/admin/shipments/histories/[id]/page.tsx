import type { Metadata } from 'next';
import { ShipmentHistoryPreview } from '@/components/admin/shipment-preview';
export const metadata:Metadata={title:'Shipment location history'};
export default async function History({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ShipmentHistoryPreview id={id}/>;}
