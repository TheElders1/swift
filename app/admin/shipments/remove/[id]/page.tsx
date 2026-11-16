import type { Metadata } from 'next';
import { ShipmentDeletePreview } from '@/components/admin/shipment-preview';
export const metadata:Metadata={title:'Delete shipment preview'};
export default async function RemoveShipment({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ShipmentDeletePreview id={id}/>;}
