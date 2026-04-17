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
      // Start content hidden slightly below
      gsap.set([headlineRef.current, bodyRef.current, ctaRef.current, tagsRef.current], {
        opacity: 0,
        y: 40,
      });

      // Background image: start zoomed in a little, translate up as scroll progresses
      gsap.set(bgRef.current, { scale: 1.08, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          scrub: 1.2,
          pin: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            section.style.setProperty('--hero-progress', `${self.progress}`);
          },
        },
      });

      // Parallax: image slowly drifts up and de-zooms while scrolling
      tl.to(
        bgRef.current,
        { scale: 1.0, y: '-8%', ease: 'none', duration: 1 },
        0
      );

      // Overlay darkens slightly as you scroll deeper
      tl.to(
        overlayRef.current,
        { opacity: 0.72, ease: 'none', duration: 0.7 },
        0
      );

      // Content fades in at the start of scroll
      tl.to(headlineRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.25 }, 0.04);
      tl.to(bodyRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.22 }, 0.1);
      tl.to(ctaRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.2 }, 0.16);
      tl.to(tagsRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.18 }, 0.22);

      // Content slides up and fades out near the end of the pin
      tl.to(
        [headlineRef.current, bodyRef.current, ctaRef.current, tagsRef.current],
        { opacity: 0, y: -36, ease: 'power2.in', duration: 0.22, stagger: 0.04 },
        0.7
      );
    }, section);

    return () => context.revert();
  }, []);

  return { sectionRef, headlineRef, bodyRef, ctaRef, tagsRef, bgRef, overlayRef, progressRef };
}
