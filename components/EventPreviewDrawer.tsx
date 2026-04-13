'use client';

import Link from 'next/link';
import { CalendarClock, MapPin, Sparkles, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { EventSummary } from '@/lib/types';
import { formatEventDay, formatEventRange, getEventTheme } from '@/lib/event-style';

export function EventPreviewDrawer({
  event,
  open,
  onOpenChange
}: {
  event: EventSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!event) return null;

  const theme = getEventTheme(event);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-5 py-4 backdrop-blur-xl">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: theme.accentStrong }}>
              {theme.label}
            </p>
            <DialogDescription className="text-sm text-muted">Quick view</DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full p-0"
            onClick={() => onOpenChange(false)}
            aria-label="Close event drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)]">
            {event.bannerUrl ? (
              <img src={event.bannerUrl} alt={event.title} className="h-56 w-full object-cover" />
            ) : (
              <div
                className="flex h-56 w-full items-center justify-center text-5xl font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${theme.accentStrong} 0%, ${theme.accent} 100%)` }}
              >
                {event.title.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_10%,rgba(15,23,42,0.72)_100%)]" />
            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
              <span className="rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-800">
                {formatEventDay(event.startTime)}
              </span>
              {event.isPaid ? (
                <span className="rounded-full bg-[rgba(255,236,188,0.95)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">
                  Paid
                </span>
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/72">
                {theme.previewLine}
              </p>
              <DialogTitle asChild>
                <h2 className="mt-2 text-3xl font-semibold leading-tight">{event.title}</h2>
              </DialogTitle>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="info-pill px-3 py-1.5 text-xs">
              <CalendarClock className="h-3.5 w-3.5" style={{ color: theme.accent }} />
              {formatEventRange(event.startTime, event.endTime)}
            </span>
            <span className="info-pill px-3 py-1.5 text-xs">
              <Users className="h-3.5 w-3.5" style={{ color: theme.accent }} />
              Cap {event.capacity}
            </span>
            <span className="info-pill px-3 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" style={{ color: theme.accent }} />
              Score {event.engagementScore}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm leading-7 text-muted">{event.description}</p>
            <div className="space-y-2 rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.46)] p-4 dark:bg-[rgba(15,23,42,0.24)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: theme.accentStrong }}>
                What this feels like
              </p>
              <ul className="space-y-2 text-sm leading-6 text-muted">
                {theme.storyBeats.map((beat) => (
                  <li key={beat} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span>{beat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild size="lg">
              <Link href={`/events/${event.id}`}>Open full event</Link>
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Keep exploring
            </Button>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.46)] p-4 dark:bg-[rgba(15,23,42,0.24)]">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" style={{ color: theme.accent }} />
              Nearby and easy to remember
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use the map as your anchor, then come back here when a marker or card catches your attention.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
