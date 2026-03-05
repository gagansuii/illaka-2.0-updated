'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { EventSummary } from '@/lib/types';
import { Card } from '@/components/ui/card';

const SWIPE_THRESHOLD = 120;

function SwipeCard({ event, onDismiss, zIndex }: { event: EventSummary; onDismiss: () => void; zIndex: number }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-8, 8]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={() => {
        if (Math.abs(x.get()) > SWIPE_THRESHOLD) {
          onDismiss();
        } else {
          x.set(0);
        }
      }}
    >
      <Card className="h-48 space-y-2">
        <p className="font-semibold text-lg">{event.title}</p>
        <p className="text-xs text-ink/70 dark:text-white/70 max-h-12 overflow-hidden text-ellipsis">{event.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span suppressHydrationWarning>{new Date(event.startTime).toLocaleString()}</span>
          <span>Score {event.engagementScore}</span>
        </div>
        <a className="text-xs text-blue-600" href={`/events/${event.id}`}>Open event</a>
      </Card>
    </motion.div>
  );
}

export function SwipeDeck({ events, loading }: { events: EventSummary[]; loading: boolean }) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return <Card className="text-sm text-ink/70 dark:text-white/70">Loading events...</Card>;
  }

  const visible = events.filter((e) => !dismissedIds.has(e.id));

  if (!visible.length) {
    return <Card className="text-sm text-ink/70 dark:text-white/70">No events found in your ilaaka yet.</Card>;
  }

  return (
    <div className="relative h-48">
      {visible.slice(0, 3).map((event, index) => (
        <SwipeCard
          key={event.id}
          event={event}
          zIndex={10 - index}
          onDismiss={() => setDismissedIds((prev) => new Set(prev).add(event.id))}
        />
      ))}
    </div>
  );
}
