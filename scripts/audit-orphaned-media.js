const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function existsLocalMedia(url) {
  if (typeof url !== 'string' || !url.startsWith('/uploads/')) {
    return true;
  }
  const normalized = url.split('?')[0].split('#')[0].replace(/^\/+/, '');
  const absolutePath = path.join(process.cwd(), 'public', normalized);
  return fs.existsSync(absolutePath);
}

async function main() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      bannerUrl: true,
      badgeIcon: true
    }
  });

  const orphaned = [];
  for (const event of events) {
    if (event.bannerUrl.startsWith('/uploads/') && !existsLocalMedia(event.bannerUrl)) {
      orphaned.push({
        eventId: event.id,
        field: 'bannerUrl',
        url: event.bannerUrl,
        title: event.title
      });
    }
    if (event.badgeIcon.startsWith('/uploads/') && !existsLocalMedia(event.badgeIcon)) {
      orphaned.push({
        eventId: event.id,
        field: 'badgeIcon',
        url: event.badgeIcon,
        title: event.title
      });
    }
  }

  console.log(`events_checked=${events.length}`);
  console.log(`orphaned_media_refs=${orphaned.length}`);

  if (orphaned.length) {
    console.log('--- orphaned references ---');
    for (const entry of orphaned) {
      console.log(`${entry.eventId} | ${entry.field} | ${entry.url} | ${entry.title}`);
    }
  }
}

main()
  .catch((error) => {
    console.error('audit failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
