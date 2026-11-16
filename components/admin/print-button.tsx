'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return <button type="button" className="button button-green print-trigger" onClick={() => window.print()}><Printer size={16} /> Save / print PDF</button>;
}
