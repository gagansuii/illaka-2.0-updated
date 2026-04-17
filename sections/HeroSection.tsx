'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroScroll } from '@/animations/useHeroScroll';

export function HeroSection() {
  const { sectionRef, headlineRef, bodyRef, ctaRef, tagsRef, bgRef, overlayRef } = useHeroScroll();

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden [--hero-progress:0]"
    >
      {/* ── Full-bleed background image (parallax target) ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center top' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpeg"
          alt="Illaka street"
          className="h-full w-full object-cover object-[center_20%]"
          draggable={false}
          fetchPriority="high"
        />
      </div>

      {/* ── Overlay: completely clear at top, darkens only at bottom ── */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 will-change-[opacity]"
        style={{
          opacity: 0.38,
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(8,4,2,0.55) 70%, rgba(8,4,2,0.82) 100%)',
        }}
      />

      {/* ── Content: anchored to the bottom ── */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5">

          {/* Eyebrow */}
          <div ref={headlineRef} className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
              Your neighbourhood
            </p>
            <h1 className="font-[family:var(--font-fraunces)] text-5xl leading-[1.0] text-white drop-shadow-sm sm:text-6xl lg:text-[5.2rem]">
              More alive than<br className="hidden sm:block" /> you think.
            </h1>
          </div>

          <div ref={bodyRef} className="max-w-md">
            <p className="text-[15px] leading-7 text-white/75">
              Discover local events, meet your community, and find what&apos;s happening around you — right now.
            </p>
          </div>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl border-0 bg-[var(--accent)] px-7 text-white shadow-[0_4px_20px_rgba(200,102,63,0.5)] hover:bg-[var(--accent-strong)]"
            >
              <Link href="/discover">Explore events</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-white/30 bg-white/10 px-7 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/events/new">Host something</Link>
            </Button>
          </div>

          <div ref={tagsRef} className="flex flex-wrap gap-2 pb-1">
            {['Run clubs', 'Art workshops', 'Skill swaps', 'Street food', 'Open mics'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-black/22 px-3 py-1 text-xs text-white/75 backdrop-blur-sm"
              >
                <MapPin className="h-3 w-3 text-[var(--accent)]" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <svg
          className="h-5 w-5 animate-bounce text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
