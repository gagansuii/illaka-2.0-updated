'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SmokeLayer } from '@/components/SmokeLayer';

const TAGS = [
  { label: 'Run clubs', color: 'rgba(124,58,237,0.25)', border: 'rgba(124,58,237,0.4)', icon: '⚡' },
  { label: 'Art workshops', color: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.4)', icon: '🎨' },
  { label: 'Skill swaps', color: 'rgba(249,115,22,0.2)', border: 'rgba(249,115,22,0.4)', icon: '🔄' },
  { label: 'Street food', color: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.4)', icon: '🍜' },
  { label: 'Open mics', color: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.4)', icon: '🎤' },
] as const;

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });
  const contentY    = useTransform(smoothProgress, [0, 0.5], ['0%', '-18%']);
  const contentOp   = useTransform(smoothProgress, [0, 0.45], [1, 0]);
  const scrollHintOp = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ background: '#030308' }}
    >
      {/* ── Animated gradient orb layer ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-orb hero-orb--violet" />
        <div className="hero-orb hero-orb--cyan" />
        <div className="hero-orb hero-orb--orange" />
        <div className="hero-orb hero-orb--pink" />
        <div className="hero-orb hero-orb--green" />
      </div>

      {/* ── Subtle mesh grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          zIndex: 1,
        }}
      />

      {/* ── Cinematic grain texture ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.045'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          mixBlendMode: 'overlay',
          zIndex: 2,
        }}
      />

      {/* ── Bottom vignette gradient into next section ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(3,3,8,0.55) 70%, rgba(3,3,8,0.97) 100%)',
          zIndex: 3,
        }}
      />

      {/* ── Hero content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp, zIndex: 10, position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: '4rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
        className="sm:!px-8 lg:!px-12"
      >
        <div className="relative mx-auto max-w-6xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mb-5"
          >
            <span className="hero-eyebrow">
              <Sparkles className="inline h-3 w-3 mr-1.5" />
              Your neighbourhood
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="mb-6 space-y-0"
          >
            <h1
              className="font-[family:var(--font-fraunces)] leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 8.5rem)' }}
            >
              <span className="hero-gradient-text block">More alive</span>
              <span className="text-white/95 block">than you think.</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
            className="mb-7 max-w-md text-[15px] leading-7 text-white/60"
          >
            Discover local events, meet your community, and find what&apos;s happening around you — right now.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.46 }}
            className="mb-7 flex flex-wrap gap-3"
          >
            <Link href="/discover" className="hero-btn-primary group">
              Explore events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/events/new" className="hero-btn-ghost">
              Host something
            </Link>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.62 }}
            className="flex flex-wrap gap-2"
          >
            {TAGS.map((tag, i) => (
              <motion.span
                key={tag.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.07 }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md"
                style={{
                  background: tag.color,
                  border: `1px solid ${tag.border}`,
                }}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Smoke transition layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
        <SmokeLayer />
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          opacity: scrollHintOp,
          zIndex: 15,
        }}
        className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <div className="scroll-hint-bar" />
          <div className="scroll-hint-bar" style={{ opacity: 0.5, marginTop: '-2px' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
