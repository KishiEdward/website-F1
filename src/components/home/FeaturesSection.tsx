import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { container, fadeUp } from '../../motion';

const features = [
  {
    title: 'Replay Lap-by-Lap',
    desc: 'Putar ulang balapan dengan kontrol play/pause/scrub dan kecepatan 1x–4x. Posisi, compound, umur ban, dan status lintasan tampil per lap.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 4l12 8-12 8V4z" fill="currentColor" />
        <path d="M19 4v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Prediksi Ganda',
    desc: 'Dua keluaran model: laps remaining sebelum pit berikutnya (regresi) dan prediksi compound stint berikutnya (klasifikasi) beserta keyakinannya.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Timeline Stint',
    desc: 'Visualisasi stint per pembalap yang menggambar dirinya sendiri, dengan perbandingan halus antara jalannya balapan aktual dan prediksi model.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="10" height="4" rx="2" fill="currentColor" />
        <rect x="9" y="14" width="12" height="4" rx="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'Sadar Safety Car',
    desc: 'Saat SC/VSC muncul, banner animatif menyala dan prediksi ikut menyesuaikan — jendela pit sering bergeser di bawah neutralisasi.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l9 16H3l9-16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-label="Fitur utama">
      <SectionTitle
        kicker="Fitur"
        title="SATU KONSOL, SELURUH JALAN BALAPAN"
        description="Semua keluaran dilabeli sebagai prediksi dari data observasional keputusan balapan aktual — bukan klaim strategi optimal."
      />
      <motion.div
        variants={container(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((f) => (
          <Card key={f.title} className="group p-6">
            <div className="mb-5 inline-flex rounded-xl border border-line bg-surface2 p-3 text-accent transition-colors duration-300 group-hover:border-accent/50">
              {f.icon}
            </div>
            <h3 className="font-display text-2xl tracking-wide">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/15 via-surface to-surface p-8 sm:p-12"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="label-mono mb-2 text-accent">Konsol Prediksi</p>
            <h3 className="font-display text-4xl leading-none tracking-wide sm:text-5xl">
              SIAP MEMBACA BALAPAN LAP DEMI LAP?
            </h3>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Pilih tim, pembalap mengikuti otomatis. Pilih musim dan Grand Prix, lalu putar
              replay-nya. Saat ini berjalan dengan <strong className="text-ink">data demo</strong>.
            </p>
          </div>
          <Button onClick={() => navigate('/console')} className="shrink-0">
            Mulai Prediksi
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
