'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { MapPin, Map, LayoutList, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { SmokeLayer } from '@/components/SmokeLayer';

const TAGS = [
  { label: 'Run clubs', icon: '⚡', color: '#c8663f' },
  { label: 'Art workshops', icon: '🎨', color: '#d4881a' },
  { label: 'Skill swaps', icon: '🔄', color: '#0f766e' },
  { label: 'Street food', icon: '🍜', color: '#c8663f' },
  { label: 'Open mics', icon: '🎤', color: '#d4881a' },
] as const;

function FunkyButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  };

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.045, y: -4 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      onClick={handleClick}
      className={`funky-btn funky-btn--${variant} ${className}`}
    >
      <span className="funky-btn__label">{children}</span>
      {ripples.map(rp => (
        <span
          key={rp.id}
          className="funky-btn__ripple"
          style={{ left: `${rp.x}%`, top: `${rp.y}%` }}
        />
      ))}
    </motion.a>
  );
}

function ViewToggle() {
  const [active, setActive] = useState<'feed' | 'map'>('feed');
  return (
    <div className="hero-view-toggle">
      {(['feed', 'map'] as const).map(v => (
        <button
          key={v}
          onClick={() => setActive(v)}
          className={`hero-view-toggle__btn${active === v ? ' active' : ''}`}
        >
          {active === v && (
            <motion.span
              layoutId="toggle-pill"
              className="hero-view-toggle__pill"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {v === 'feed'
              ? <LayoutList className="h-3.5 w-3.5" />
              : <Map className="h-3.5 w-3.5" />}
            {v === 'feed' ? 'Feed' : 'Map'}
          </span>
        </button>
      ))}
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });
  const imageY      = useTransform(smoothProgress, [0, 1], ['0%', '20%']);
  const contentY    = useTransform(smoothProgress, [0, 0.5], ['0%', '-16%']);
  const contentOp   = useTransform(smoothProgress, [0, 0.45], [1, 0]);
  const titleY      = useTransform(smoothProgress, [0, 0.6], ['0%', '-28%']);
  const titleOp     = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const scrollHintOp = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ background: '#1a0e06' }}
    >
      {/* ── Full-bleed background photo ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 h-[118%] w-full will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ui-image.jpeg"
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
          draggable={false}
          fetchPriority="high"
        />
      </motion.div>

      {/* ── Warm layered overlays ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(10,5,2,0.22) 0%, transparent 20%, transparent 45%, rgba(10,5,2,0.62) 72%, rgba(10,5,2,0.94) 100%)',
        zIndex: 2,
      }} />
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(200,102,63,0.08) 0%, transparent 60%)',
        zIndex: 2,
      }} />

      {/* ── Grain texture ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.042'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
        mixBlendMode: 'overlay',
        zIndex: 3,
      }} />

      {/* ── ILLAKA brand title — top-center, floats on scroll ── */}
      <motion.div
        style={{ y: titleY, opacity: titleOp, zIndex: 10 }}
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-[12vh] sm:pt-[14vh]"
      >
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <h1 className="illaka-brand-title">iLLAKA</h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="illaka-brand-divider"
          />
        </motion.div>
      </motion.div>

      {/* ── Bottom content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp, zIndex: 10 }}
        className="absolute inset-x-0 bottom-0 px-5 pb-14 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-5xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-4"
          >
            <span className="hero-eyebrow-warm">
              <MapPin className="inline h-3 w-3 mr-1" />
              Your neighbourhood
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="font-[family:var(--font-fraunces)] mb-4 leading-[1.0] text-white"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}
          >
            More alive than<br className="hidden sm:block" /> you think.
          </motion.h2>

          {/* Description + toggle row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <p className="max-w-sm text-[14px] leading-7 text-white/65">
              Discover local events, meet your community,<br className="hidden sm:block" /> and find what&apos;s happening around you.
            </p>
            <ViewToggle />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="mb-6 flex flex-wrap gap-3"
          >
            <FunkyButton href="/discover" variant="primary">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Explore events
                <ArrowRight className="h-4 w-4" />
              </span>
            </FunkyButton>
            <FunkyButton href="/events/new" variant="ghost">
              Host something
            </FunkyButton>
          </motion.div>

          {/* Category tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="flex flex-wrap gap-2"
          >
            {TAGS.map((tag, i) => (
              <motion.button
                key={tag.label}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.78 + i * 0.07 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hero-tag"
                style={{ '--tag-color': tag.color } as React.CSSProperties}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Smoke transition ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
        <SmokeLayer />
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{ opacity: scrollHintOp, zIndex: 15 }}
        className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
