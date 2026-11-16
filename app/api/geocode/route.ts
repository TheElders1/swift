import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to look up shipment coordinates.' }, { status: 401 });

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });

  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (query.length < 2 || query.length > 180) {
    return NextResponse.json({ error: 'Enter a city or country between 2 and 180 characters.' }, { status: 400 });
  }

  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '1');
  url.searchParams.set('lang', 'en');

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/geo+json', 'User-Agent': 'SwiftSurgeLogistics/1.0 (admin location lookup)' },
      next: { revalidate: 86400 },
    });
    if (!response.ok) return NextResponse.json({ error: 'The location service is busy or unavailable. Try again or enter coordinates manually.' }, { status: 502 });
    const payload = await response.json() as {
      features?: Array<{
        geometry?: { coordinates?: [number, number] };
        properties?: { name?: string; city?: string; state?: string; country?: string };
      }>;
    };
    const result = payload.features?.[0];
    const [lng, lat] = result?.geometry?.coordinates || [];
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'No matching city or country was found. Try adding its country name.' }, { status: 404 });
    }
    const place = result?.properties;
    const label = [place?.name || place?.city, place?.state, place?.country].filter(Boolean).join(', ') || query;
    return NextResponse.json({ lat, lng, label });
  } catch {
    return NextResponse.json({ error: 'The location service could not be reached. Enter coordinates manually or try again.' }, { status: 502 });
  }
}
