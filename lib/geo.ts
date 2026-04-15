export type GeoLocation = { latitude: number; longitude: number; city?: string; region?: string };

const GEO_TIMEOUT_MS = 1_500;
const BREAKER_FAILURE_THRESHOLD = 3;
const BREAKER_OPEN_MS = 60_000;

type BreakerState = {
  failures: number;
  state: 'closed' | 'open' | 'half-open';
  openUntil: number;
};

const geoBreakers: Record<'ipinfo' | 'ipapi', BreakerState> = {
  ipinfo: { failures: 0, state: 'closed', openUntil: 0 },
  ipapi: { failures: 0, state: 'closed', openUntil: 0 }
};

function shouldCallProvider(state: BreakerState) {
  if (state.state !== 'open') {
    return true;
  }
  if (Date.now() >= state.openUntil) {
    state.state = 'half-open';
    return true;
  }
  return false;
}

function markProviderSuccess(state: BreakerState) {
  state.failures = 0;
  state.state = 'closed';
  state.openUntil = 0;
}

function markProviderFailure(state: BreakerState) {
  if (state.state === 'half-open') {
    state.failures = 0;
    state.state = 'open';
    state.openUntil = Date.now() + BREAKER_OPEN_MS;
    return;
  }

  state.failures += 1;
  if (state.failures >= BREAKER_FAILURE_THRESHOLD) {
    state.failures = 0;
    state.state = 'open';
    state.openUntil = Date.now() + BREAKER_OPEN_MS;
  }
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function ipFallbackLocation(ip: string): Promise<GeoLocation | null> {
  const ipInfoToken = process.env.IPINFO_TOKEN;
  if (ipInfoToken && shouldCallProvider(geoBreakers.ipinfo)) {
    try {
      const res = await fetchWithTimeout(`https://ipinfo.io/${ip}?token=${ipInfoToken}`);
      if (!res.ok) {
        markProviderFailure(geoBreakers.ipinfo);
        return null;
      }
      const data = await res.json();
      if (!data.loc) {
        markProviderFailure(geoBreakers.ipinfo);
        return null;
      }
      const [lat, lng] = data.loc.split(',').map(Number);
      markProviderSuccess(geoBreakers.ipinfo);
      return { latitude: lat, longitude: lng, city: data.city, region: data.region };
    } catch (err) {
      markProviderFailure(geoBreakers.ipinfo);
      console.error('ipinfo.io lookup failed:', err);
    }
  }

  if (!shouldCallProvider(geoBreakers.ipapi)) {
    return null;
  }

  try {
    const res = await fetchWithTimeout(`https://ip-api.com/json/${ip}`);
    if (!res.ok) {
      markProviderFailure(geoBreakers.ipapi);
      return null;
    }
    const data = await res.json();
    if (data.status !== 'success') {
      markProviderFailure(geoBreakers.ipapi);
      return null;
    }
    markProviderSuccess(geoBreakers.ipapi);
    return { latitude: data.lat, longitude: data.lon, city: data.city, region: data.regionName };
  } catch (err) {
    markProviderFailure(geoBreakers.ipapi);
    console.error('ip-api.com lookup failed:', err);
    return null;
  }
}
