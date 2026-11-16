import type { Metadata } from 'next';
import { ShipmentEditPreview } from '@/components/admin/shipment-preview';
export const metadata:Metadata={title:'Edit shipment preview'};
export default async function EditShipment({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ShipmentEditPreview id={id}/>;}
