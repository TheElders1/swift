import type { Metadata } from 'next';
import { PdfGallery } from '@/components/pdf-gallery';
export const metadata:Metadata={title:'Shipment PDF preview'};
export default async function GeneratePdf({params}:{params:Promise<{id:string;type:string}>}){const {id,type}=await params;return <PdfGallery shipmentId={id} type={type}/>;}
