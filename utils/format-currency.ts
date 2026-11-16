export function formatCurrency(amount: number | null | undefined, currency: string | null | undefined): string {
  if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) return '—';

  const currencyLabel = currency?.trim().toUpperCase() || 'USD';
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency: currencyLabel }).format(Number(amount));
  } catch {
    // Older records may contain a display label such as "Reais" instead of
    // an ISO currency code. Keep the shipment page usable for those records.
    return `${Number(amount).toLocaleString('en')} ${currencyLabel}`;
  }
}
