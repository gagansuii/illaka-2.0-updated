import { NextResponse } from 'next/server';
import { ipFallbackLocation } from '@/lib/geo';

export async function GET(req: Request) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : null;
    if (!ip) {
      // Previously fell back to 8.8.8.8 (Google DNS), which always geolocates
      // to Mountain View, CA — silently giving every user the wrong location.
      return NextResponse.json({ error: 'Cannot determine client IP' }, { status: 400 });
    }
    const location = await ipFallbackLocation(ip);
    if (!location) return NextResponse.json({ error: 'Unable to locate' }, { status: 404 });
    return NextResponse.json(location);
  } catch (err) {
    console.error('Geo IP lookup error:', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
