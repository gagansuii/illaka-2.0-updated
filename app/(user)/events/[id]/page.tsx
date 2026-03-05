import { prisma } from '@/lib/prisma';
import { EventDetailClient } from '@/components/EventDetailClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: true, rsvps: true }
  });

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  if (event.visibility === 'PRIVATE') {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId || (event.organizerId !== userId && session?.user?.role !== 'ADMIN')) {
      return <div className="p-6">Event not found</div>;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <EventDetailClient event={event} />
    </div>
  );
}
