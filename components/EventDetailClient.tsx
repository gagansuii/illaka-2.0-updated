'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PaymentButton } from '@/components/PaymentButton';
import { useSession } from 'next-auth/react';

export function EventDetailClient({ event }: { event: any }) {
  const { data } = useSession();
  const [rsvpCount, setRsvpCount] = useState(event.rsvps?.length ?? 0);
  const [loading, setLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const hostingThreshold = Number(process.env.NEXT_PUBLIC_HOSTING_FEE_THRESHOLD ?? 50);
  const hostingFee = Number(process.env.NEXT_PUBLIC_HOSTING_FEE_AMOUNT ?? 25000);
  const promotionPrice = Number(process.env.NEXT_PUBLIC_PROMOTION_PRICE ?? 15000);

  async function rsvp() {
    setLoading(true);
    setRsvpError('');
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, { method: 'POST' });
      if (res.ok) {
        setRsvpCount((c: number) => c + 1);
      } else {
        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        setRsvpError(data?.error ?? 'Could not RSVP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl overflow-hidden">
        {event.bannerUrl && <img src={event.bannerUrl} alt={event.title} className="w-full h-60 object-cover" />}
      </div>
      <Card className="space-y-3">
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <p className="text-sm text-ink/70 dark:text-white/70">{event.description}</p>
        <div className="text-sm text-ink/70 dark:text-white/70">
          <p suppressHydrationWarning>{new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
          <p>Capacity {event.capacity}</p>
          <p>RSVPs {rsvpCount}</p>
        </div>
        <Button onClick={rsvp} disabled={loading}>{loading ? 'Reserving...' : 'RSVP'}</Button>
        {rsvpError && <p className="text-sm text-red-500">{rsvpError}</p>}
        {data?.user?.id === event.organizerId && rsvpCount >= hostingThreshold && (
          <PaymentButton label="Pay hosting fee" reason="hosting_fee" amount={hostingFee} eventId={event.id} />
        )}
        {data?.user?.id === event.organizerId && (
          <PaymentButton label="Boost event promotion" reason="promotion" amount={promotionPrice} eventId={event.id} />
        )}
      </Card>
    </div>
  );
}
