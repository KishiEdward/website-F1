import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { gsap, gsapEase, prefersReducedMotion, stagger } from '../../motion';
import carImg from '../../assets/f1-car.png';

/** Ilustrasi ban besar (SVG buatan sendiri) */
function BigTyre() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="tyreGrad" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#1d1d24" />
          <stop offset="100%" stopColor="#0c0c10" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#tyreGrad)" stroke="#2a2a33" strokeWidth="3" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * 188}
            y1={200 + Math.sin(a) * 188}
            x2={200 + Math.cos(a) * 158}
            y2={200 + Math.sin(a) * 158}
            stroke="#232329"
            strokeWidth="9"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="200" cy="200" r="128" fill="none" stroke="var(--accent)" strokeWidth="14" opacity="0.9" />
      <circle cx="200" cy="200" r="104" fill="#101015" stroke="#2a2a33" strokeWidth="2" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={200 + Math.cos(a) * 62}
            cy={200 + Math.sin(a) * 62}
            r="16"
            fill="#1a1a22"
            stroke="#33333d"
            strokeWidth="3"
          />
        );
      })}
      <circle cx="200" cy="200" r="26" fill="#1a1a22" stroke="#33333d" strokeWidth="3" />
    </svg>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tyreRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const bobRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      /* --- stagger reveal judul per karakter --- */
      const chars = titleRef.current?.querySelectorAll<HTMLElement>('.hero-char');
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { yPercent: reduced ? 0 : 115, opacity: reduced ? 0.4 : 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: reduced ? 0.4 : 1,
            ease: gsapEase.expo,
            stagger: stagger.xs,
            delay: 0.15,
          },
        );
      }

      gsap.fromTo(
        '.hero-sub',
        { opacity: 0, y: reduced ? 0 : 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: gsapEase.out, delay: 0.7, stagger: stagger.sm },
      );

      const streaks = windRef.current?.querySelectorAll<HTMLElement>('.wind-streak');
      if (reduced) {
        // reduced motion: angin jadi garis statis samar, bukan dihapus tanpa pengganti
        if (streaks?.length) gsap.set(streaks, { opacity: 0.3 });
        return;
      }

      /* --- rotasi ban terus-menerus --- */
      gsap.to(tyreRef.current, { rotation: 360, duration: 26, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });

      /* --- bob mobil: suspensi tertekan downforce, seolah siap akselerasi --- */
      gsap.fromTo(
        bobRef.current,
        { y: 0, rotation: 0.5 },
        { y: -6, rotation: -0.7, duration: 0.55, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 90%' },
      );

      /* --- streak angin mengalir dari depan ke belakang bodi --- */
      streaks?.forEach((s, i) => {
        const d = 1.15 + (i % 4) * 0.22;
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.21 });
        tl.fromTo(s, { x: -130 }, { x: 130, duration: d, ease: 'none' }, 0)
          .fromTo(s, { opacity: 0 }, { opacity: 0.85, duration: 0.35, ease: 'none' }, 0)
          .to(s, { opacity: 0, duration: 0.45, ease: 'none' }, d - 0.45);
      });

      /* --- parallax scroll --- */
      gsap.to(tyreRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to(linesRef.current, {
        yPercent: 40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '70% top', scrub: 0.6 },
      });
      gsap.to('.hero-content', {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });

      /* --- parallax kursor --- */
      const layers: [HTMLElement | null, number][] = [
        [tyreRef.current, 26],
        [carRef.current, -18],
        [glowRef.current, 12],
      ];
      const quicks = layers.map(([el, depth]) => ({
        x: el ? gsap.quickTo(el, 'x', { duration: 0.9, ease: gsapEase.out }) : null,
        y: el ? gsap.quickTo(el, 'y', { duration: 0.9, ease: gsapEase.out }) : null,
        depth,
      }));
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        quicks.forEach((q) => {
          q.x?.(nx * q.depth * 2);
          q.y?.(ny * q.depth);
        });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  const split = (text: string) =>
    text.split('').map((ch, i) =>
      ch === ' ' ? (
        <span key={i} className="inline-block w-[0.3em]" />
      ) : (
        <span key={i} className="hero-char inline-block will-change-transform">
          {ch}
        </span>
      ),
    );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-grid"
      aria-label="Hero — Prediksi Pit Stop F1"
    >
      {/* glow latar */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-40 top-1/4 h-[560px] w-[560px] rounded-full opacity-40 blur-[140px]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-60"
        style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(58,58,90,0.35) 0%, transparent 60%)' }}
        aria-hidden="true"
      />

      {/* garis kecepatan */}
      <div ref={linesRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[14, 26, 44, 63, 78, 88].map((top, i) => (
          <div
            key={top}
            className="absolute h-px bg-gradient-to-r from-transparent via-line to-transparent"
            style={{ top: `${top}%`, left: `${(i * 13) % 40}%`, width: `${30 + ((i * 17) % 45)}%` }}
          />
        ))}
      </div>

      {/* ban besar kanan */}
      <div
        className="pointer-events-none absolute -right-24 inset-y-0 hidden w-[520px] items-center opacity-80 md:flex lg:w-[640px]"
        aria-hidden="true"
      >
        <div ref={tyreRef} className="w-full will-change-transform">
          <BigTyre />
        </div>
      </div>

      {/* mobil bawah — sisi kanan, bebas dari baris statistik, di atas bar disclaimer */}
      <div className="pointer-events-none absolute bottom-2 right-4 opacity-90 sm:right-8 lg:right-16" aria-hidden="true">
        <div ref={carRef} className="relative w-[320px] will-change-transform sm:w-[420px] lg:w-[520px]">
          <div ref={bobRef} className="will-change-transform">
            <img src={carImg} alt="" className="h-auto w-full select-none" draggable={false} />
          </div>
          {/* streak angin yang mengenai bodi mobil */}
          <div ref={windRef} className="pointer-events-none absolute -inset-x-8 inset-y-0" aria-hidden="true">
            {[
              { top: '20%', left: '2%', w: 'w-16' },
              { top: '36%', left: '-8%', w: 'w-24' },
              { top: '52%', left: '8%', w: 'w-20' },
              { top: '68%', left: '-4%', w: 'w-14' },
              { top: '28%', left: '46%', w: 'w-16' },
              { top: '60%', left: '52%', w: 'w-20' },
            ].map((p, i) => (
              <span
                key={i}
                className={`wind-streak absolute h-px rounded-full bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 ${p.w}`}
                style={{ top: p.top, left: p.left }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6">
        <p className="hero-sub label-mono mb-4 flex items-center gap-2 opacity-0">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          Skripsi · Model hybrid XGBoost–LSTM · Musim 2021–2025
        </p>
        <h1
          ref={titleRef}
          className="overflow-hidden font-display text-[clamp(3.2rem,10vw,8.5rem)] leading-[0.92] tracking-wide"
        >
          <span className="block overflow-hidden">{split('PREDIKSI')}</span>
          <span className="block overflow-hidden">
            {split('PIT STOP')}{' '}
            <span className="text-accent">{split('F1')}</span>
          </span>
        </h1>
        <p className="hero-sub mt-6 max-w-xl text-base leading-relaxed text-muted opacity-0 sm:text-lg">
          Kapan pembalap masuk pit berikutnya, dan compound apa yang dipasang?
          Jelajahi replay lap-by-lap dengan <strong className="text-ink">prediksi</strong> model —
          berbasis keputusan balapan aktual (observasional), bukan strategi optimal.
        </p>
        <div className="hero-sub mt-9 flex flex-wrap items-center gap-4 opacity-0">
          <Button onClick={() => navigate('/console')} aria-label="Mulai prediksi — buka konsol">
            Mulai Prediksi
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button variant="outline" onClick={() => navigate('/model')}>
            Tentang Model
          </Button>
        </div>

        <div className="hero-sub mt-14 flex flex-wrap gap-x-10 gap-y-4 opacity-0">
          {[
            ['2021–2025', 'Cakupan musim'],
            ['Laps remaining', 'Output regresi'],
            ['Compound', 'Output klasifikasi'],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-3xl tracking-wide text-ink">{v}</p>
              <p className="label-mono mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* petunjuk scroll */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="label-mono">Gulir</span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
