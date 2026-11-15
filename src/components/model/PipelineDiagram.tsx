import { useEffect, useRef } from 'react';
import { gsap, gsapEase, prefersReducedMotion, stagger } from '../../motion';

const stages = [
  {
    tag: 'INPUT',
    title: 'Fitur per lap',
    items: ['Compound & umur ban', 'Posisi & lap berjalan', 'Status lintasan (SC/VSC/Red)', 'Musim & karakteristik sirkuit'],
    color: '#0093CC',
  },
  {
    tag: 'STAGE 1',
    title: 'XGBoost',
    items: ['Menangkap pola tabular non-linear', 'Relasi fitur → keputusan pit', 'Feature importance untuk interpretasi'],
    color: '#E10600',
  },
  {
    tag: 'STAGE 2',
    title: 'LSTM',
    items: ['Membaca urutan lap sebagai sekuens', 'Konteks stint & degradasi ban', 'Dinamika balapan dari waktu ke waktu'],
    color: '#FFB020',
  },
  {
    tag: 'OUTPUT',
    title: 'Dua kepala prediksi',
    items: ['Regresi: laps remaining sebelum pit', 'Klasifikasi: compound stint berikutnya', 'Probabilitas per compound + keyakinan'],
    color: '#39B54A',
  },
];

/** Diagram pipeline XGBoost → LSTM → output, dianimasikan bertahap saat scroll. */
export function PipelineDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set('.pipe-card', { opacity: 1, y: 0 });
        gsap.set('.pipe-line', { strokeDashoffset: 0 });
        gsap.set('.pipe-dot', { opacity: 0 });
        return;
      }

      /* garis konektor menggambar mengikuti scroll */
      gsap.fromTo(
        '.pipe-line',
        { strokeDashoffset: 240 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 85%', scrub: 0.5 },
        },
      );

      /* kartu muncul bertahap seiring scroll */
      gsap.utils.toArray<HTMLElement>('.pipe-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 46, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: gsapEase.out,
            scrollTrigger: { trigger: card, start: 'top 84%', toggleActions: 'play none none reverse' },
            delay: i * stagger.xs,
          },
        );
      });

      /* titik data mengalir di sepanjang konektor */
      gsap.utils.toArray<SVGLineElement>('.pipe-line').forEach((line) => {
        const dot = line.parentElement?.querySelector<SVGCircleElement>(`[data-for="${line.dataset.id}"]`);
        if (!dot) return;
        const x1 = Number(line.getAttribute('x1') ?? 0);
        const x2 = Number(line.getAttribute('x2') ?? 0);
        gsap.fromTo(
          dot,
          { attr: { cx: x1 }, opacity: 0 },
          {
            attr: { cx: x2 },
            opacity: 1,
            duration: 1.6,
            ease: 'none',
            repeat: -1,
            repeatDelay: 0.4,
            scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom bottom', toggleActions: 'play pause resume pause' },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* konektor SVG (desktop) */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-[120px] hidden h-8 w-full lg:block"
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line
              data-id={`l${i}`}
              className="pipe-line"
              x1={i * 400 + 200}
              y1="16"
              x2={i * 400 + 400}
              y2="16"
              stroke="#3a3a4a"
              strokeWidth="2.5"
              strokeDasharray="240"
            />
            <circle data-for={`l${i}`} className="pipe-dot" cx={i * 400 + 200} cy="16" r="4.5" fill="var(--accent)" opacity="0" />
          </g>
        ))}
      </svg>

      <div className="grid gap-5 lg:grid-cols-4">
        {stages.map((s) => (
          <div
            key={s.tag}
            className="pipe-card surface-card relative overflow-hidden p-6 opacity-100 will-change-transform"
          >
            <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.color }} aria-hidden="true" />
            <p className="label-mono" style={{ color: s.color }}>
              {s.tag}
            </p>
            <h3 className="mt-1 font-display text-3xl leading-none tracking-wide">{s.title}</h3>
            <ul className="mt-4 space-y-2">
              {s.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[13px] leading-snug text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* panah vertikal untuk mobile */}
      <div className="flex flex-col items-center gap-1 lg:hidden" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <svg key={i} width="20" height="26" viewBox="0 0 20 26" className="-my-3 text-line">
            <path d="M10 0v20M4 16l6 7 6-7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        ))}
      </div>
    </div>
  );
}
