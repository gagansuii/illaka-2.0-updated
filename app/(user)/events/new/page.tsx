'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [isPaid, setIsPaid] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok || !data?.url) {
      throw new Error(data?.error ?? 'Upload failed');
    }
    return data.url as string;
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error('Geolocation error', err);
        setError('Unable to fetch location: ' + err.message);
      },
      { timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (latitude === null || longitude === null) {
      setError('Please set a location for the event.');
      return;
    }

    if (!bannerUrl || !badgeIcon) {
      setError('Please upload both a banner image and a badge icon.');
      return;
    }

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      setError('End time must be after start time.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        startTime,
        endTime,
        capacity,
        visibility,
        isPaid,
        latitude,
        longitude,
        bannerUrl,
        badgeIcon
      })
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = '/';
    } else {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      setError(data?.error ?? 'Failed to create event.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Host a new event</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <Input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
              Paid event
            </label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as any)} className="rounded-xl border border-ink/10 bg-white/80 px-3 py-2">
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input type="number" step="0.0001" placeholder="Latitude" value={latitude ?? ''} onChange={(e) => setLatitude(Number(e.target.value))} />
            <Input type="number" step="0.0001" placeholder="Longitude" value={longitude ?? ''} onChange={(e) => setLongitude(Number(e.target.value))} />
          </div>
          <Button type="button" variant="outline" onClick={useMyLocation}>Use my location</Button>

          <div className="space-y-2">
            <label className="text-sm">Banner image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                try {
                  const url = await upload(e.target.files[0], 'ilaka/banners');
                  setBannerUrl(url);
                } catch (uploadError) {
                  setError(uploadError instanceof Error ? uploadError.message : 'Banner upload failed');
                }
              }}
            />
            {bannerUrl && <p className="text-xs text-ink/60">Uploaded</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm">Badge icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                try {
                  const url = await upload(e.target.files[0], 'ilaka/badges');
                  setBadgeIcon(url);
                } catch (uploadError) {
                  setError(uploadError instanceof Error ? uploadError.message : 'Badge upload failed');
                }
              }}
            />
            {badgeIcon && <p className="text-xs text-ink/60">Uploaded</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>Create event</Button>
        </form>
      </Card>
    </div>
  );
}
