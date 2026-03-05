export type GeoLocation = { latitude: number; longitude: number; city?: string; region?: string };

export async function ipFallbackLocation(ip: string): Promise<GeoLocation | null> {
  const ipInfoToken = process.env.IPINFO_TOKEN;
  if (ipInfoToken) {
    try {
      const res = await fetch(`https://ipinfo.io/${ip}?token=${ipInfoToken}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.loc) return null;
      const [lat, lng] = data.loc.split(',').map(Number);
      return { latitude: lat, longitude: lng, city: data.city, region: data.region };
    } catch (err) {
      console.error('ipinfo.io lookup failed:', err);
      return null;
    }
  }

  try {
    const res = await fetch(`https://ip-api.com/json/${ip}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return { latitude: data.lat, longitude: data.lon, city: data.city, region: data.regionName };
  } catch (err) {
    console.error('ip-api.com lookup failed:', err);
    return null;
  }
}
