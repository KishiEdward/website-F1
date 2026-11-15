import { motion } from 'framer-motion';
import { PipelineDiagram } from '../components/model/PipelineDiagram';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { container, fadeUp } from '../motion';

const sources = [
  {
    name: 'Jolpica F1 API',
    role: 'Data balapan historis: hasil per lap, posisi, stint ban, status safety car, musim 2021–2025.',
  },
  {
    name: 'FastF1',
    role: 'Telemetri dan data ban yang lebih granuler untuk memperkaya fitur model (tahap pengembangan).',
  },
];

const leakage = [
  'Prediksi pada lap N hanya memakai informasi yang tersedia hingga lap N — tidak ada data masa depan yang bocor ke fitur.',
  'Label (kapan pit terjadi & compound berikutnya) dibangun dari event setelah lap N, dipisahkan ketat dari fitur.',
  'Pembagian data latih/uji dilakukan per balapan (dan skema per musim untuk uji generalisasi), bukan pengacakan baris acak.',
  'Status Safety Car/VSC diperlakukan sebagai kondisi yang diketahui pada waktunya, bukan sebagai sinyal masa depan.',
];

export default function Model() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-14 max-w-3xl">
        <p className="label-mono text-accent">Tentang Model</p>
        <h1 className="mt-1 font-display text-5xl leading-none tracking-wide sm:text-7xl">
          HYBRID <span className="text-accent">XGBOOST–LSTM</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Model ini memprediksi dua hal untuk setiap pembalap pada setiap lap: berapa lap lagi
          sebelum pit stop berikutnya (regresi) dan compound apa yang diprediksi dipakai pada
          stint berikutnya (klasifikasi). Pelatihan masih berlangsung — antarmuka ini saat ini
          berjalan dengan data demo.
        </p>
      </motion.div>

      <section aria-label="Pipeline model" className="mb-20">
        <SectionTitle kicker="Arsitektur" title="PIPELINE PREDIKSI" />
        <PipelineDiagram />
      </section>

      <div className="mb-20 grid gap-5 lg:grid-cols-2">
        <section aria-label="Sumber data">
          <SectionTitle kicker="Data" title="SUMBER & CAKUPAN" />
          <motion.div variants={container(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-4">
            {sources.map((s) => (
              <Card key={s.name} className="p-6">
                <h3 className="font-display text-2xl tracking-wide text-accent">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.role}</p>
              </Card>
            ))}
            <Card className="p-6">
              <h3 className="font-display text-2xl tracking-wide">Cakupan</h3>
              <p className="mt-2 font-mono text-sm text-muted">
                Musim <strong className="text-ink">2021–2025</strong> · seluruh Grand Prix ·
                compound: SOFT, MEDIUM, HARD, INTERMEDIATE, WET · status lintasan: Green, SC, VSC, Red.
              </p>
            </Card>
          </motion.div>
        </section>

        <section aria-label="Pencegahan data leakage">
          <SectionTitle kicker="Validitas" title="PENCEGAHAN DATA LEAKAGE" />
          <motion.div variants={container(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Card className="p-6">
              <ul className="space-y-4">
                {leakage.map((l, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/15 font-mono text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    {l}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </section>
      </div>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        aria-label="Disclaimer"
        className="overflow-hidden rounded-3xl border border-medium/30 bg-medium/5 p-8 sm:p-10"
      >
        <p className="label-mono mb-2 text-medium">Disclaimer</p>
        <h2 className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
          PREDIKSI OBSERVASIONAL, BUKAN STRATEGI OPTIMAL
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Model dilatih dari keputusan pit stop yang <strong className="text-ink">benar-benar
          diambil tim</strong> pada balapan 2021–2025. Artinya, keluaran model mencerminkan pola
          keputusan aktual di lapangan — termasuk pertimbangan yang tidak teramati seperti
          preferensi pembalap, politik balapan, atau keterbatasan data cuaca real-time. Ini{' '}
          <strong className="text-ink">bukan</strong> klaim bahwa waktu pit tersebut optimal
          secara matematis, dan tidak dimaksudkan sebagai rekomendasi strategi. Selama
          antarmuka berjalan dengan data demo, tidak ada klaim akurasi model apa pun yang
          ditampilkan.
        </p>
      </motion.section>
    </div>
  );
}
