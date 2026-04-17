'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useHeroScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      // Content starts invisible, slightly below
      gsap.set([headlineRef.current, bodyRef.current, ctaRef.current, tagsRef.current], {
        opacity: 0,
        y: 28,
      });

      // Image starts very subtly zoomed so there's room to breathe
      gsap.set(bgRef.current, { scale: 1.05, y: 0 });

      // Stagger the content in immediately on page load (no scroll needed for first reveal)
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0)
        .to(bodyRef.current,    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.18)
        .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.32)
        .to(tagsRef.current,    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.44);

      // Scroll-driven parallax: pin the hero and drift the image
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          scrub: 2,            // higher = smoother/lazier follow
          pin: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            section.style.setProperty('--hero-progress', `${self.progress}`);
          },
        },
      })
        // Gentle upward drift + slight de-zoom on the image
        .to(bgRef.current, { scale: 1.0, y: '-6%', ease: 'none', duration: 1 }, 0)
        // Overlay barely changes — stays light so the image remains visible
        .to(overlayRef.current, { opacity: 0.55, ease: 'none', duration: 1 }, 0)
        // Content drifts up very slowly with the scroll (parallax depth)
        .to(
          [headlineRef.current, bodyRef.current, ctaRef.current, tagsRef.current],
          { y: -20, ease: 'none', duration: 1 },
          0
        );
    }, section);

    return () => context.revert();
  }, []);

  return { sectionRef, headlineRef, bodyRef, ctaRef, tagsRef, bgRef, overlayRef, progressRef };
}
