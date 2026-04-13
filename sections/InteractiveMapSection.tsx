'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/motion';
import { EventPreviewDrawer } from '@/components/EventPreviewDrawer';
import { Button } from '@/components/ui/button';
import { formatEventDay, formatEventRange, getEventTheme } from '@/lib/event-style';
import type { EventSummary } from '@/lib/types';

const MapView = dynamic(
  () => import('@/components/MapView').then((module) => module.MapView),
  { ssr: false }
);

const FALLBACK_EVENT_TIMES = {
  runStart: '2026-03-16T01:00:00.000Z',
  runEnd: '2026-03-16T02:30:00.000Z',
  paintStart: '2026-03-16T11:30:00.000Z',
  paintEnd: '2026-03-16T13:30:00.000Z',
  skillStart: '2026-03-17T05:30:00.000Z',
  skillEnd: '2026-03-17T07:30:00.000Z'
} as const;

const fallbackEvents: EventSummary[] = [
  {
    id: 'landing-run-club',
    title: 'Morning Run Club',
    description: 'A friendly sunrise loop that starts with easy conversation and ends with chai.',
    bannerUrl: '',
    badgeIcon: '',
    latitude: 28.6205,
    longitude: 77.221,
    startTime: FALLBACK_EVENT_TIMES.runStart,
    endTime: FALLBACK_EVENT_TIMES.runEnd,
    visibility: 'PUBLIC',
    capacity: 28,
    organizerId: 'landing',
    isPaid: false,
    engagementScore: 94
  },
  {
    id: 'landing-paint',
    title: 'Terrace Painting Workshop',
    description: 'A soft golden-hour workshop with a local artist and room for first-timers.',
    bannerUrl: '',
    badgeIcon: '',
    latitude: 28.6142,
    longitude: 77.2059,
    startTime: FALLBACK_EVENT_TIMES.paintStart,
    endTime: FALLBACK_EVENT_TIMES.paintEnd,
    visibility: 'PUBLIC',
    capacity: 18,
    organizerId: 'landing',
    isPaid: true,
    engagementScore: 91
  },
  {
    id: 'landing-skillshare',
    title: 'Neighborhood Coding Circle',
    description: 'A practical, low-pressure session for learning together with people nearby.',
    bannerUrl: '',
    badgeIcon: '',
    latitude: 28.609,
    longitude: 77.228,
    startTime: FALLBACK_EVENT_TIMES.skillStart,
    endTime: FALLBACK_EVENT_TIMES.skillEnd,
    visibility: 'PUBLIC',
    capacity: 24,
    organizerId: 'landing',
    isPaid: false,
    engagementScore: 88
  }
];

export function InteractiveMapSection() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.209]);
  const [events, setEvents] = useState<EventSummary[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [previewedEventId, setPreviewedEventId] = useState<string>(fallbackEvents[0].id);
  const [drawerEvent, setDrawerEvent] = useState<EventSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents(nextCenter: [number, number]) {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?lat=${nextCenter[0]}&lng=${nextCenter[1]}&radius=7000`);
        if (!res.ok) {
          if (!cancelled) setEvents(fallbackEvents);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          const nextEvents = (data.events?.length ? data.events : fallbackEvents) as EventSummary[];
          setEvents(nextEvents);
          setPreviewedEventId(nextEvents[0]?.id ?? fallbackEvents[0].id);
        }
      } catch {
        if (!cancelled) setEvents(fallbackEvents);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCenter(nextCenter);
          void loadEvents(nextCenter);
        },
        () => {
          void loadEvents([28.6139, 77.209]);
        },
        { timeout: 6000 }
      );
    } else {
      void loadEvents([28.6139, 77.209]);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const previewedEvent = useMemo(
    () => events.find((event) => event.id === previewedEventId) ?? events[0] ?? fallbackEvents[0],
    [events, previewedEventId]
  );

  return (
    <section id="live-map" className="px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }} variants={fadeUp}>
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.36)] p-5 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between sm:p-6 dark:bg-[rgba(15,23,42,0.18)]">
            <div className="max-w-2xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--secondary)]">
                Nearby now
              </p>
              <h2 className="font-[family:var(--font-fraunces)] text-3xl leading-[0.96] sm:text-4xl">
                Explore what is happening around you.
              </h2>
              <p className="text-sm leading-7 text-muted sm:text-base">
                A cleaner way to scan the map, preview a few strong local events, and dive deeper only when something feels worth opening.
              </p>
            </div>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/discover">Open full explorer</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
          <div className="overflow-hidden rounded-[2.4rem] border border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_28px_90px_rgba(17,24,39,0.14)]">
            <div className="relative h-[520px]">
              <MapView
                events={events}
                center={center}
                radius={7000}
                previewedEventId={previewedEvent?.id}
                onPreviewEvent={(event) => setPreviewedEventId(event.id)}
                onOpenEvent={(event) => setDrawerEvent(event)}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,24,0.08)_0%,rgba(12,18,24,0.02)_40%,rgba(12,18,24,0.34)_100%)]" />
              <div className="pointer-events-none absolute left-4 top-4">
                <div className="rounded-full border border-white/18 bg-[rgba(15,23,42,0.58)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/86 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                  {loading ? 'Loading nearby activity' : `${events.length} events nearby`}
                </div>
              </div>

              {previewedEvent ? (
                <button
                  type="button"
                  onClick={() => setDrawerEvent(previewedEvent)}
                  className="absolute bottom-4 left-4 right-4 rounded-[1.8rem] border border-white/16 bg-[rgba(15,23,42,0.58)] p-4 text-left text-white shadow-[0_18px_44px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:max-w-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/64">Preview</p>
                  <p className="mt-2 text-xl font-semibold">{previewedEvent.title}</p>
                  <p className="mt-1 text-sm text-white/72">
                    {formatEventDay(previewedEvent.startTime)} / {formatEventRange(previewedEvent.startTime, previewedEvent.endTime)}
                  </p>
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            {events.slice(0, 3).map((event) => {
              const theme = getEventTheme(event);
              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  type="button"
                  onMouseEnter={() => setPreviewedEventId(event.id)}
                  onFocus={() => setPreviewedEventId(event.id)}
                  onClick={() => setDrawerEvent(event)}
                  className="block w-full rounded-[2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.44)] p-5 text-left shadow-[0_22px_50px_rgba(17,24,39,0.08)] transition-transform dark:bg-[rgba(15,23,42,0.24)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ background: theme.accentSoft, color: theme.accentStrong }}>
                      {theme.label}
                    </span>
                    <span className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.45)] px-3 py-1 text-xs font-medium dark:bg-[rgba(15,23,42,0.24)]">
                      {event.isPaid ? 'Paid' : 'Open'}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold sm:text-2xl">{event.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="info-pill px-3 py-1.5 text-xs">
                      <CalendarClock className="h-3.5 w-3.5" style={{ color: theme.accent }} />
                      {formatEventRange(event.startTime, event.endTime)}
                    </span>
                    <span className="info-pill px-3 py-1.5 text-xs">
                      <Users className="h-3.5 w-3.5" style={{ color: theme.accent }} />
                      Cap {event.capacity}
                    </span>
                    <span className="info-pill px-3 py-1.5 text-xs">
                      <MapPin className="h-3.5 w-3.5" style={{ color: theme.accent }} />
                      Nearby
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <EventPreviewDrawer
        event={drawerEvent}
        open={Boolean(drawerEvent)}
        onOpenChange={(open) => {
          if (!open) setDrawerEvent(null);
        }}
      />
    </section>
  );
}
