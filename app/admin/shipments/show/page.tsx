import type { Metadata } from 'next';
import { PdfGallery } from '@/components/pdf-gallery';
export const metadata:Metadata={title:'Shipment document preview'};
export default function ShipmentPreview(){return <PdfGallery/>;}
