'use client';

import { useEffect, useRef, useState } from 'react';

type Point = { lat: number | null; lng: number | null; label: string; kind: 'origin' | 'current' | 'destination' | 'history' };

type LeafletCircle = { addTo(map: LeafletMap): LeafletCircle; bindPopup(content: string): LeafletCircle };
type LeafletMap = {
  setView(center: [number, number], zoom: number): LeafletMap;
  fitBounds(points: [number, number][], options?: { padding?: [number, number] }): LeafletMap;
  invalidateSize(): LeafletMap;
  remove(): void;
};
type LeafletApi = {
  map(element: HTMLElement): LeafletMap;
  tileLayer(url: string, options: { attribution: string; maxZoom: number }): { addTo(map: LeafletMap): void };
  circleMarker(point: [number, number], options: Record<string, string | number>): LeafletCircle;
  polyline(points: [number, number][], options: Record<string, string | number>): { addTo(map: LeafletMap): void };
};

declare global {
  interface Window { L?: LeafletApi }
}

let leafletLoading: Promise<LeafletApi> | null = null;
const escapePopupText = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoading) return leafletLoading;

  leafletLoading = new Promise<LeafletApi>((resolve, reject) => {
    if (!document.querySelector('link[data-swiftsurge-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/vendor/leaflet/leaflet.css';
      link.dataset.swiftsurgeLeaflet = 'true';
      document.head.appendChild(link);
    }

    const script = document.querySelector<HTMLScriptElement>('script[data-swiftsurge-leaflet]')
      || document.createElement('script');
    const ready = () => window.L ? resolve(window.L) : reject(new Error('Map library did not initialize.'));
    if (script.dataset.swiftsurgeLeaflet && window.L) return ready();
    script.src = '/vendor/leaflet/leaflet.js';
    script.dataset.swiftsurgeLeaflet = 'true';
    script.onload = ready;
    script.onerror = () => reject(new Error('Map library could not be loaded.'));
    if (!script.isConnected) document.body.appendChild(script);
  }).catch((error) => {
    leafletLoading = null;
    throw error;
  });

  return leafletLoading;
}

function isCoordinate(lat: number | null, lng: number | null): lat is number {
  return typeof lat === 'number' && Number.isFinite(lat) && typeof lng === 'number' && Number.isFinite(lng);
}

export function TrackingMap({ points }: { points: Point[] }) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const validPoints = points.filter((point): point is Point & { lat: number; lng: number } => isCoordinate(point.lat, point.lng));
  const validPointsJson = JSON.stringify(validPoints);

  useEffect(() => {
    const pointsForMap = JSON.parse(validPointsJson) as Array<Point & { lat: number; lng: number }>;
    if (!mapElement.current || pointsForMap.length === 0) return;
    let disposed = false;
    let map: LeafletMap | undefined;
    let resizeTimer = 0;

    void loadLeaflet().then((L) => {
      if (disposed || !mapElement.current) return;
      map = L.map(mapElement.current);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const coords = [...new Map(pointsForMap.map(({ lat, lng }) => [`${lat.toFixed(5)},${lng.toFixed(5)}`, [lat, lng] as [number, number]])).values()];
      if (coords.length > 1) {
        L.polyline(coords, { color: '#078777', weight: 4, opacity: 0.78 }).addTo(map);
        map.fitBounds(coords, { padding: [28, 28] });
      } else {
        map.setView(coords[0], 6);
      }

      const colors = { origin: '#0b7285', current: '#078777', destination: '#f07835', history: '#75a79a' };
      pointsForMap.forEach((point) => {
        L.circleMarker([point.lat, point.lng], {
          radius: point.kind === 'current' ? 9 : 7,
          color: '#ffffff',
          weight: 3,
          fillColor: colors[point.kind],
          fillOpacity: 1,
        }).addTo(map!).bindPopup(escapePopupText(point.label));
      });

      resizeTimer = window.setTimeout(() => map?.invalidateSize(), 80);
    }).catch(() => { if (!disposed) setMapError(true); });

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      map?.remove();
    };
  }, [validPointsJson]);

  if (!validPoints.length) return <div className="tracking-map-empty">Map details will appear when location coordinates are available.</div>;

  return <div className="tracking-map-wrap">
    {mapError ? <div className="tracking-map-empty">The map could not be loaded right now. Your shipment updates are still available below.</div> : <div ref={mapElement} className="tracking-map-canvas" aria-label="Shipment route map" role="application" />}
    <div className="tracking-map-legend"><span><i className="map-origin"/> Origin</span><span><i className="map-current"/> Latest location</span><span><i className="map-destination"/> Destination</span></div>
    <small className="tracking-map-credit">Map data © OpenStreetMap contributors</small>
  </div>;
}
