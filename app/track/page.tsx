import type { Metadata } from 'next';
import { TrackingView } from '@/components/tracking-view';
export const metadata:Metadata={title:'Track a shipment'};
export default async function Track({searchParams}:{searchParams:Promise<{id?:string}>}){const {id}=await searchParams;return <TrackingView initialCode={id??''}/>;}
