'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type DashboardPayload = {
  total_events: number;
  total_registrations: number;
  total_revenue: number;
  upcoming_events: number;
};

const EMPTY_DASHBOARD: DashboardPayload = {
  total_events: 0,
  total_registrations: 0,
  total_revenue: 0,
  upcoming_events: 0
};

export function OrganizerDashboard() {
  const [dashboard, setDashboard] = useState<DashboardPayload>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const res = await fetch('/organizer/dashboard', { cache: 'no-store' });
        let body: unknown = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }

        if (!active) return;
        if (!res.ok) {
          setError((body as { error?: string } | null)?.error ?? 'Unable to load organizer analytics');
          return;
        }

        const data = body as DashboardPayload;
        setDashboard({
          total_events: Number(data.total_events ?? 0),
          total_registrations: Number(data.total_registrations ?? 0),
          total_revenue: Number(data.total_revenue ?? 0),
          upcoming_events: Number(data.upcoming_events ?? 0)
        });
      } catch {
        if (active) setError('Unable to load organizer analytics');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { title: 'Events', value: dashboard.total_events, subtext: 'Total created' },
      { title: 'Registrations', value: dashboard.total_registrations, subtext: 'Across all events' },
      { title: 'Revenue', value: `\u20B9${(dashboard.total_revenue / 100).toLocaleString('en-IN')}`, subtext: 'Successful payments' },
      { title: 'Upcoming', value: dashboard.upcoming_events, subtext: 'Future events' }
    ],
    [dashboard]
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Organizer analytics</h2>
        <Link
          href="/discover"
          className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm text-muted transition-colors hover:bg-[var(--surface-strong)]"
        >
          View events
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="h-3 w-20 rounded bg-[rgba(148,163,184,0.35)]" />
              <div className="mt-3 h-8 w-16 rounded bg-[rgba(148,163,184,0.35)]" />
              <div className="mt-3 h-3 w-24 rounded bg-[rgba(148,163,184,0.35)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 transition-opacity duration-300 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs text-muted">{card.subtext}</p>
            </div>
          ))}
        </div>
      )}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </section>
  );
}
