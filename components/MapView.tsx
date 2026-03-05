'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { EventSummary } from '@/lib/types';

const defaultCenter: [number, number] = [28.6139, 77.209];

function makeBadgeIcon(badgeIcon: string) {
  return L.divIcon({
    html: `<div style="width:38px;height:38px;border-radius:50%;overflow:hidden;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.45);background:#1a1a2e;display:flex;align-items:center;justify-content:center;">
      <img src="${badgeIcon}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='📍'" />
    </div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
}

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#7ef9ff;border:3px solid white;box-shadow:0 0 0 3px rgba(126,249,255,0.35);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -12]
});

export function MapView({
  events,
  center,
  radius
}: {
  events: EventSummary[];
  center: [number, number] | null;
  radius: number;
}) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
  }, []);

  const mapCenter = center ?? defaultCenter;

  const badgeIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const event of events) {
      if (event.badgeIcon) map.set(event.id, makeBadgeIcon(event.badgeIcon));
    }
    return map;
  }, [events]);

  return (
    <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && (
        <>
          <Marker position={center} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
          <Circle center={center} radius={radius} pathOptions={{ color: '#7ef9ff', fillOpacity: 0.06, weight: 1.5 }} />
        </>
      )}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
          icon={badgeIcons.get(event.id)}
        >
          <Popup>
            <div className="space-y-1 min-w-[140px]">
              {event.bannerUrl && (
                <img src={event.bannerUrl} alt={event.title} style={{ width: '100%', height: '72px', objectFit: 'cover', borderRadius: '6px' }} />
              )}
              <p className="font-semibold text-sm">{event.title}</p>
              <p className="text-xs" style={{ color: '#888' }}>{new Date(event.startTime).toLocaleString()}</p>
              {event.isPaid && <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">Paid</span>}
              <br />
              <a className="text-xs text-blue-600" href={`/events/${event.id}`}>View details →</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
