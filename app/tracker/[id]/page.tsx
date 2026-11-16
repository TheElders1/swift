import type { Metadata } from 'next';
import { TrackingView } from '@/components/tracking-view';
export const metadata:Metadata={title:'Shipment tracking'};
export default async function Tracker({params}:{params:Promise<{id:string}>}){const {id}=await params;return <TrackingView key={id} initialCode={id}/>;}
