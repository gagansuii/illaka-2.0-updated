'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Maximize2, Minimize2, MapPin, Search } from 'lucide-react';
import type { EventSummary } from '@/lib/types';

const MapView = dynamic(
  () => import('@/components/MapView').then((m) => m.MapView),
  { ssr: false }
);

export function MapScreen() {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(5000);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  const centerParams = useMemo(() => {
    if (!center) return '';
    return `lat=${center[0]}&lng=${center[1]}&radius=${radius}`;
  }, [center, radius]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextCenter: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCenter(nextCenter);
        void updateLocation(nextCenter);
      },
      async () => {
        try {
          const res = await fetch('/api/geo/ip');
          if (res.ok) {
            const data = await res.json();
            const nextCenter: [number, number] = [data.latitude, data.longitude];
            setCenter(nextCenter);
            void updateLocation(nextCenter);
            return;
          }
        } catch { /* IP geo unavailable */ }
        setCenter([28.6139, 77.209]);
      }
    );
  }, []);

  const loadEvents = useCallback(async () => {
    if (!centerParams) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events?${centerParams}`);
      if (!res.ok) { setEvents([]); return; }
      const data = await res.json();
      setEvents(data.events ?? []);
    } finally {
      setLoading(false);
    }
  }, [centerParams]);

  useEffect(() => {
    if (!centerParams) return;
    void loadEvents();
  }, [centerParams, loadEvents]);

  useEffect(() => {
    if (center) void updateLocation(center);
  }, [radius]);

  async function updateLocation(nextCenter: [number, number]) {
    await fetch('/api/users/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: nextCenter[0], longitude: nextCenter[1], radius })
    });
  }

  async function handleSearch() {
    if (!query || !center) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, latitude: center[0], longitude: center[1], radius })
      });
      if (!res.ok) { setEvents([]); return; }
      const data = await res.json();
      setEvents(data.events ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">

      {/* ── Map banner / fullscreen ── */}
      <div className={mapExpanded ? 'fixed inset-0 z-50' : 'relative h-[45vh]'}>
        <MapView events={events} center={center} radius={radius} />

        {/* Expand / collapse */}
        <button
          onClick={() => setMapExpanded((v) => !v)}
          className="absolute top-3 right-3 glass rounded-full p-2 hover:bg-white/20 transition-colors"
          aria-label={mapExpanded ? 'Collapse map' : 'Expand map'}
        >
          {mapExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Fullscreen overlaid controls */}
        {mapExpanded && (
          <>
            <div className="absolute left-3 right-12 top-3 flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search activities near you…"
                className="glass"
              />
              <Button onClick={handleSearch} size="sm"><Search className="h-4 w-4" /></Button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Radius</span>
                <span className="text-cyan-400 font-semibold">{(radius / 1000).toFixed(1)} km</span>
              </div>
              <Slider value={[radius]} min={1000} max={20000} step={500} onValueChange={(v) => setRadius(v[0] ?? radius)} />
              <div className="flex justify-between text-xs text-ink/40 dark:text-white/40 mt-1">
                <span>1 km</span><span>20 km</span>
              </div>
            </div>
            {events.length > 0 && (
              <div className="absolute top-16 left-3 glass rounded-full px-3 py-1 flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-medium">{events.length}</span>
                <span className="text-ink/70 dark:text-white/70">event{events.length !== 1 ? 's' : ''} nearby</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Below-map content (hidden when fullscreen) ── */}
      {!mapExpanded && (
        <div className="px-4 pt-4 space-y-4">

          {/* Search */}
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search activities near you…"
            />
            <Button onClick={handleSearch} size="sm"><Search className="h-4 w-4" /></Button>
          </div>

          {/* Radius */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Search radius</span>
              <span className="text-cyan-400 font-semibold">{(radius / 1000).toFixed(1)} km</span>
            </div>
            <Slider value={[radius]} min={1000} max={20000} step={500} onValueChange={(v) => setRadius(v[0] ?? radius)} />
            <div className="flex justify-between text-xs text-ink/40 dark:text-white/40 mt-1">
              <span>1 km</span><span>20 km</span>
            </div>
          </div>

          {/* Events nearby */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                Nearby Events
              </h2>
              {!loading && (
                <span className="text-sm text-ink/50 dark:text-white/50">
                  {events.length} found
                </span>
              )}
            </div>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && events.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-ink/50 dark:text-white/50">
                No events in your area yet. Be the first to host one!
              </div>
            )}

            {!loading && events.length > 0 && (
              <div className="space-y-3">
                {events.map((event) => (
                  <a
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-3"
                  >
                    {event.bannerUrl ? (
                      <img src={event.bannerUrl} alt={event.title} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center text-2xl">
                        {event.badgeIcon
                          ? <img src={event.badgeIcon} alt="" className="h-10 w-10 rounded-full object-cover" />
                          : '📍'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm leading-tight">{event.title}</p>
                        {event.isPaid && (
                          <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full flex-shrink-0">Paid</span>
                        )}
                      </div>
                      <p className="text-xs text-ink/50 dark:text-white/50 mt-0.5 line-clamp-2">{event.description}</p>
                      <p className="text-xs text-ink/40 dark:text-white/40 mt-1">
                        {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {' · '}
                        {new Date(event.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        Cap. {event.capacity}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create event FAB */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full text-xl z-40 shadow-lg"
        onClick={() => (window.location.href = '/events/new')}
      >
        +
      </Button>
    </div>
  );
}
