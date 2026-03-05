import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const [userCount, eventCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.payment.aggregate({ _sum: { amount: true } })
  ]);

  const events = await prisma.event.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
  const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } });

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="text-3xl font-semibold">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-ink/60 dark:text-white/60">Total users</p>
          <p className="text-2xl font-semibold">{userCount}</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-ink/60 dark:text-white/60">Active events</p>
          <p className="text-2xl font-semibold">{eventCount}</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-ink/60 dark:text-white/60">Revenue</p>
          <p className="text-2xl font-semibold">&#8377;{(revenue._sum.amount ?? 0) / 100}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-xl font-semibold mb-3">Recent events</h2>
          <ul className="space-y-2 text-sm">
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between">
                <span>{event.title}</span>
                <form action={`/api/admin/events/${event.id}`} method="post">
                  <button className="text-xs text-red-500">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-5">
          <h2 className="text-xl font-semibold mb-3">Recent users</h2>
          <ul className="space-y-2 text-sm">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.email}</span>
                <form action={`/api/admin/users/${user.id}`} method="post">
                  <button className="text-xs text-red-500">Ban</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
