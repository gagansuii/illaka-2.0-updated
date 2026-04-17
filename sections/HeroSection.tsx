'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAGS = ['Run clubs', 'Art workshops', 'Skill swaps', 'Street food', 'Open mics'] as const;

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring on top of the raw scroll value
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });

  // Image drifts up as you scroll (parallax) — stays fully visible, just moves
  const imageY = useTransform(smoothProgress, [0, 1], ['0%', '22%']);

  // Overlay fades in slightly to keep text readable deeper in scroll
  const overlayOpacity = useTransform(smoothProgress, [0, 0.6], [0.25, 0.65]);

  // Content fades out and lifts as you scroll away
  const contentY   = useTransform(smoothProgress, [0, 0.5], ['0%', '-18%']);
  const contentOp  = useTransform(smoothProgress, [0, 0.45], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* ── Full-bleed background image ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 h-[115%] w-full will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpeg"
          alt=""
          className="h-full w-full object-cover object-[center_18%]"
          draggable={false}
          fetchPriority="high"
        />
      </motion.div>

      {/* ── Static bottom vignette — always on, keeps text readable ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(5,2,1,0.52) 65%, rgba(5,2,1,0.88) 100%)',
        }}
      />

      {/* ── Animated overlay — barely visible at start, deepens on scroll ── */}
      <motion.div
        style={{
          opacity: overlayOpacity,
          background: 'rgba(5,2,1,0.18)',
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* ── Text content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="absolute inset-x-0 bottom-0 px-4 pb-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">

          {/* Headline — staggered entry on mount */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mb-4 space-y-2"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
              Your neighbourhood
            </p>
            <h1 className="font-[family:var(--font-fraunces)] text-5xl leading-[1.0] text-white sm:text-6xl lg:text-[5.2rem]">
              More alive than<br className="hidden sm:block" /> you think.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-5 max-w-md text-[15px] leading-7 text-white/75"
          >
            Discover local events, meet your community, and find what&apos;s happening around you — right now.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.44 }}
            className="mb-5 flex flex-wrap gap-3"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl border-0 bg-[var(--accent)] px-7 text-white shadow-[0_4px_22px_rgba(200,102,63,0.55)] hover:bg-[var(--accent-strong)] transition-all"
            >
              <Link href="/discover">Explore events</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-white/28 bg-white/10 px-7 text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <Link href="/events/new">Host something</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/72 backdrop-blur-sm"
              >
                <MapPin className="h-3 w-3 text-[var(--accent)]" />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ opacity: useTransform(smoothProgress, [0, 0.15], [1, 0]) }}
        className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
      >
        <motion.svg
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-5 w-5 text-white/45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
