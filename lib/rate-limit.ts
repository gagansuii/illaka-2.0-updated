import { LRUCache } from 'lru-cache';
import Redis from 'ioredis';

const cache = new LRUCache<string, number>({
  max: 5000,
  ttl: 1000 * 60
});

let redis: Redis | null = null;
function getRedis() {
  if (redis === null && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

// rateLimit returns a promise for the caller to await.  if a Redis
// connection is provided via REDIS_URL we use it (scaled across instances);
// otherwise we fall back to an in‑memory LRU cache with a warning log.
export async function rateLimit(key: string, limit = 60): Promise<boolean> {
  const r = getRedis();
  if (r) {
    try {
      const count = await r.incr(key);
      if (count === 1) {
        await r.expire(key, 60);
      }
      return count <= limit;
    } catch (err) {
      console.error('Redis rateLimit error, falling back to memory', err);
      // fall through to memory code
    }
  }

  const current = cache.get(key) ?? 0;
  if (current >= limit) return false;
  cache.set(key, current + 1);
  return true;
}
