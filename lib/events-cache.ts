const eventsCache = new Map<string, { events: unknown[]; fetchedAt: number }>();
const inFlightEventRefreshes = new Map<string, Promise<unknown[]>>();

export const EVENT_CACHE_MAX_ENTRIES = 500;
const RADIUS_BUCKET_METERS = 100;

export function normalizeCoord(value: number) {
  return Math.round(value * 10_000) / 10_000;
}

function normalizeRadiusForKey(value: number) {
  const safe = Number.isFinite(value) && value > 0 ? value : 5_000;
  return Math.max(500, Math.round(safe / RADIUS_BUCKET_METERS) * RADIUS_BUCKET_METERS);
}

export function makeEventsCacheKey(lat: number, lng: number, radius: number) {
  return `${normalizeCoord(lat)}:${normalizeCoord(lng)}:${normalizeRadiusForKey(radius)}`;
}

export function getCachedEvents(cacheKey: string) {
  return eventsCache.get(cacheKey);
}

export function setCachedEvents(cacheKey: string, events: unknown[]) {
  eventsCache.set(cacheKey, { events, fetchedAt: Date.now() });
  if (eventsCache.size > EVENT_CACHE_MAX_ENTRIES) {
    const oldestKey = eventsCache.keys().next().value;
    if (oldestKey) {
      eventsCache.delete(oldestKey);
    }
  }
}

export function getInFlightEventsRefresh(cacheKey: string) {
  return inFlightEventRefreshes.get(cacheKey);
}

export function setInFlightEventsRefresh(cacheKey: string, refreshPromise: Promise<unknown[]>) {
  inFlightEventRefreshes.set(cacheKey, refreshPromise);
}

export function clearInFlightEventsRefresh(cacheKey: string) {
  inFlightEventRefreshes.delete(cacheKey);
}

export function clearEventsCache() {
  eventsCache.clear();
  inFlightEventRefreshes.clear();
}
