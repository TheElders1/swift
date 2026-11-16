'use client';

import { useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

type LocationCoordinateFieldsProps = {
  locationName: string;
  defaultLocation?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
  required?: boolean;
};

export function LocationCoordinateFields({ locationName, defaultLocation = '', defaultLat = null, defaultLng = null, required = false }: LocationCoordinateFieldsProps) {
  const [location, setLocation] = useState(defaultLocation || '');
  const [lat, setLat] = useState(defaultLat === null ? '' : String(defaultLat));
  const [lng, setLng] = useState(defaultLng === null ? '' : String(defaultLng));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const queryId = useRef(0);
  const lastResolvedLocation = useRef(defaultLocation || '');

  async function resolveCoordinates() {
    const query = location.trim();
    if (query.length < 2 || (query === lastResolvedLocation.current && lat && lng)) return;
    const requestId = ++queryId.current;
    setBusy(true);
    setMessage('Looking up the city or country…');
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const payload = await response.json() as { lat?: number; lng?: number; label?: string; error?: string };
      if (requestId !== queryId.current) return;
      if (!response.ok || typeof payload.lat !== 'number' || typeof payload.lng !== 'number') {
        throw new Error(payload.error || 'Could not find that location. Enter coordinates manually.');
      }
      setLat(String(payload.lat));
      setLng(String(payload.lng));
      lastResolvedLocation.current = query;
      setMessage(`Coordinates set for ${payload.label || query}.`);
    } catch (error) {
      if (requestId === queryId.current) setMessage(error instanceof Error ? error.message : 'Location lookup failed. Enter coordinates manually.');
    } finally {
      if (requestId === queryId.current) setBusy(false);
    }
  }

  return <>
    <label className="location-coordinate-place">Current location<input name={locationName} value={location} onChange={(event) => {
      const nextLocation = event.target.value;
      setLocation(nextLocation);
      if (nextLocation.trim() !== lastResolvedLocation.current) {
        setLat(''); setLng(''); setMessage('');
      }
    }} onBlur={() => void resolveCoordinates()} placeholder="City, country" required={required} />
      <small><MapPin size={12}/>{busy ? 'Generating coordinates…' : 'Enter a city or country; coordinates are generated when you leave this field.'}</small>
    </label>
    <label>Latitude<input name="lat" type="number" step="any" value={lat} onChange={(event) => setLat(event.target.value)} placeholder="Auto-generated or enter manually" /></label>
    <label>Longitude<input name="lng" type="number" step="any" value={lng} onChange={(event) => setLng(event.target.value)} placeholder="Auto-generated or enter manually" /></label>
    {message && <span className={`location-coordinate-message${busy ? ' is-busy' : ''}`} role="status">{message}</span>}
    <span className="location-coordinate-attribution">Location lookup by Photon · © OpenStreetMap contributors</span>
  </>;
}
