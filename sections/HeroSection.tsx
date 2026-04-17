'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroScroll } from '@/animations/useHeroScroll';

const NeighborhoodCanvas = dynamic(
  () => import('@/three/NeighborhoodCanvas').then((module) => module.NeighborhoodCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),rgba(255,255,255,0.08))]" />
  }
);

export function HeroSection() {
  const { sectionRef, headlineRef, bodyRef, ctaRef, progressRef } = useHeroScroll();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden px-4 pt-20 [--hero-progress:0] sm:px-6 lg:px-8"
    >
      {/* 3D background canvas */}
      <div className="absolute inset-0 opacity-60">
        <NeighborhoodCanvas progressRef={progressRef} />
      </div>
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,237,226,0.2)_0%,rgba(245,237,226,0.0)_40%,rgba(245,237,226,0.85)_100%)] dark:bg-[linear-gradient(180deg,rgba(14,20,27,0.2)_0%,rgba(14,20,27,0.0)_40%,rgba(14,20,27,0.88)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-5xl flex-col justify-end pb-16 gap-6">
        <div ref={headlineRef} className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Your neighbourhood
          </p>
          <h1 className="font-[family:var(--font-fraunces)] text-5xl leading-[1.0] sm:text-6xl lg:text-[5.5rem]">
            More alive than<br />you think.
          </h1>
        </div>

        <div ref={bodyRef} className="max-w-lg">
          <p className="text-base leading-7 text-[var(--muted)] sm:text-lg">
            Discover local events, join the community, and find what&apos;s happening in your ilaaka — right now.
          </p>
        </div>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white border-0 px-6">
            <Link href="/discover">Explore events</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-[var(--line)] px-6">
            <Link href="/events/new">Host something</Link>
          </Button>
        </div>

        {/* Quick info pills */}
        <div className="flex flex-wrap gap-2">
          {['Run clubs', 'Art workshops', 'Skill swaps', 'Street food', 'Open mics'].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)] backdrop-blur-sm"
            >
              <MapPin className="h-3 w-3 text-[var(--accent)]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)] backdrop-blur-xl">
        Scroll to explore
      </div>
    </section>
  );
}
