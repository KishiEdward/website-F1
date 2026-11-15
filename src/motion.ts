import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Transition, Variants } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- durasi (detik) ---------- */
export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.8,
  cinematic: 1.4,
};

/* ---------- stagger (detik) ---------- */
export const stagger = {
  xs: 0.04,
  sm: 0.08,
  md: 0.12,
  lg: 0.2,
};

/* ---------- easing framer-motion ---------- */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const transition = {
  smooth: { duration: duration.base, ease: EASE_OUT } satisfies Transition,
  snappy: { duration: duration.fast, ease: EASE_OUT } satisfies Transition,
  page: { duration: 0.5, ease: EASE_IN_OUT } satisfies Transition,
  spring: { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 } satisfies Transition,
  springSoft: { type: 'spring', stiffness: 180, damping: 26 } satisfies Transition,
};

/* ---------- easing GSAP ---------- */
export const gsapEase = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
};

/* ---------- variants framer-motion ---------- */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: transition.smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.smooth },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: transition.spring },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: transition.smooth },
};

/** Kartu pembalap: flip + slide-in */
export const driverFlip: Variants = {
  hidden: { opacity: 0, y: 40, rotateY: -25, scale: 0.94 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: { ...transition.spring, delay: i * stagger.lg },
  }),
};

export const container = (staggerTime = stagger.md): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: staggerTime } },
});

/* ---------- transisi halaman ---------- */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: EASE_IN_OUT } },
};

/** Versi reduced-motion: tetap ada transisi halus, hanya lebih ringan. */
export const pageTransitionReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
