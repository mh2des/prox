"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal — wraps any children and triggers a reveal animation
 * when the element enters the viewport.
 *
 * Props:
 *   animation  : 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fadeIn' | 'scaleUp' | 'slideUp'
 *   delay      : CSS delay string, e.g. '0.2s'
 *   className  : extra classNames to pass through
 *   threshold  : 0–1 intersection ratio (default 0.15)
 */
export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = '0s',
  className = '',
  threshold = 0.15,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  // `static` short-circuits the whole effect: no offset, no transition, the
  // content is simply there. Both start false so the server render and the
  // first client render agree; the effect below flips them after hydration.
  const [isStatic, setIsStatic] = useState(false);
  // On phones a horizontal reveal (translateX ±56px) shifts a full-width block
  // sideways while it is still in flow, which is a real source of transient
  // horizontal overflow. Below 768px we reveal vertically instead.
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setIsStatic(true);
      setVisible(true);
      return;
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      setNarrow(window.matchMedia('(max-width: 768px)').matches);
    }

    // No IntersectionObserver (very old browser) → never hide the content,
    // otherwise the page renders permanently blank.
    if (typeof IntersectionObserver === 'undefined') {
      setIsStatic(true);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const inViewport = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    // ── Fail-safe #1: reveal anything already on screen, without waiting ──
    // This content is server-rendered at opacity:0, so ANY failure to fire
    // leaves a blank page. Deep links, a language switch that re-mounts the
    // tree with the section already in view, a restored scroll position, or an
    // environment where IntersectionObserver is throttled (backgrounded tab,
    // some in-app/WebView browsers) would all otherwise strand it at 0.
    if (inViewport()) {
      setVisible(true);
      return;
    }

    // `threshold` is a fraction of the ELEMENT, not of the viewport. Several
    // pages wrap an entire section in ONE ScrollReveal — /our-work puts the
    // whole project list inside a single wrapper 3800px tall. In an 850px
    // viewport at most 850/3800 = 22% of that block can ever be on screen, so
    // a 0.15 threshold is only met once it nearly fills the screen, leaving a
    // long dead zone where the section is scrolled into view but still blank.
    // For anything taller than the viewport, switch to "its top edge came into
    // view". Short elements keep the original behaviour.
    const isTallerThanViewport =
      el.getBoundingClientRect().height > window.innerHeight * 0.9;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };

    // ── Fail-safe #2: a plain scroll check backing up the observer ──
    // Cheap (a rect read behind rAF) and only alive until the element reveals.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (inViewport()) reveal();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) reveal(); },
      isTallerThanViewport
        ? { threshold: 0, rootMargin: '0px 0px -10% 0px' }
        : { threshold }
    );

    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isStatic || visible ? 1 : 0,
        transform: isStatic ? 'none' : getInitialTransform(animation, visible, narrow),
        transition: isStatic
          ? 'none'
          : `opacity 0.75s ease ${delay}, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`,
        willChange: isStatic ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

function getInitialTransform(animation, visible, narrow) {
  if (visible) return 'none';
  // Sideways travel is swapped for a short vertical travel on small screens —
  // same effect, none of the off-canvas width.
  if (narrow && (animation === 'fadeLeft' || animation === 'fadeRight')) {
    return 'translateY(32px)';
  }
  switch (animation) {
    case 'fadeUp':    return narrow ? 'translateY(32px)' : 'translateY(48px)';
    case 'fadeDown':  return narrow ? 'translateY(-32px)' : 'translateY(-48px)';
    case 'fadeLeft':  return 'translateX(-56px)';
    case 'fadeRight': return 'translateX(56px)';
    case 'scaleUp':   return 'scale(0.88)';
    case 'slideUp':   return narrow ? 'translateY(40px)' : 'translateY(72px)';
    default:          return 'translateY(32px)';
  }
}
