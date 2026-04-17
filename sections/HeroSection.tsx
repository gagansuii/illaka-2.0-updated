'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroScroll } from '@/animations/useHeroScroll';

export function HeroSection() {
  const { sectionRef, headlineRef, bodyRef, ctaRef, tagsRef, bgRef, overlayRef, progressRef: _p } = useHeroScroll();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden [--hero-progress:0]"
    >
      {/* ── Parallax background image ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpeg"
          alt="Illaka street scene"
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* ── Dark gradient overlay (animated) ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: 0.42,
          background:
            'linear-gradient(180deg, rgba(10,6,3,0.28) 0%, rgba(10,6,3,0.18) 35%, rgba(10,6,3,0.72) 100%)',
        }}
      />

      {/* ── Subtle warm tint at bottom for readability ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent_0%,rgba(20,10,4,0.55)_100%)]" />

      {/* ── Content ── */}
      <div className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">

          {/* Headline */}
          <div ref={headlineRef} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              Your neighbourhood
            </p>
            <h1 className="font-[family:var(--font-fraunces)] text-5xl leading-[1.0] text-white sm:text-6xl lg:text-[5.5rem]">
              More alive than<br />you think.
            </h1>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="max-w-lg">
            <p className="text-base leading-7 text-white/80 sm:text-lg">
              Discover local events, meet your community, and find what&apos;s happening in your ilaaka — right now.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white border-0 px-7 shadow-[0_4px_24px_rgba(200,102,63,0.5)]"
            >
              <Link href="/discover">Explore events</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-7"
            >
              <Link href="/events/new">Host something</Link>
            </Button>
          </div>

          {/* Tags */}
          <div ref={tagsRef} className="flex flex-wrap gap-2">
            {['Run clubs', 'Art workshops', 'Skill swaps', 'Street food', 'Open mics'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
              >
                <MapPin className="h-3 w-3 text-[var(--accent)]" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 backdrop-blur-md">
            Scroll to explore
          </span>
          {/* Animated chevron */}
          <svg
            className="h-5 w-5 animate-bounce text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
