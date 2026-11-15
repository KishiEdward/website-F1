import { motion } from 'framer-motion';
import type { Stint } from '../../api/types';
import { COMPOUND_COLORS } from '../../api/mock/db';
import { useStrategy } from '../../hooks/queries';
import { useConsoleStore } from '../../store/useConsoleStore';
import { SectionTitle } from '../ui/SectionTitle';
import { Segmented } from '../ui/Segmented';
import { Skeleton } from '../ui/Skeleton';
import { transition } from '../../motion';

interface StintRowProps {
  label: string;
  color: string;
  stints: Stint[];
  totalLaps: number;
  mode: 'actual' | 'predicted';
}

function StintRow({ label, color, stints, totalLaps, mode }: StintRowProps) {
  const w = (n: number) => `${(n / totalLaps) * 100}%`;
  return (
    <div>
      <p className="label-mono mb-1.5 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
        <span className="normal-case tracking-wide text-muted/70">
          · {mode === 'actual' ? 'jalannya balapan aktual' : 'prediksi model'}
        </span>
      </p>
      <div className="relative h-9 overflow-hidden rounded-lg border border-line bg-surface2">
        {stints.map((s, i) => (
          <motion.div
            key={`${s.startLap}-${s.compound}-${i}`}
            className="absolute inset-y-1 flex items-center overflow-hidden rounded-md"
            style={{
              left: w(s.startLap - 1),
              width: w(s.endLap - s.startLap + 1),
              backgroundColor: COMPOUND_COLORS[s.compound],
              transformOrigin: 'left center',
              opacity: mode === 'predicted' ? 0.75 : 0.92,
              border: mode === 'predicted' ? '1px dashed rgba(255,255,255,0.55)' : 'none',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...transition.smooth, duration: 0.7, delay: i * 0.12 }}
          >
            <span
              className="px-2 font-mono text-[10px] font-bold whitespace-nowrap"
              style={{ color: s.compound === 'HARD' ? '#111' : '#fff' }}
            >
              {s.compound === 'INTERMEDIATE' ? 'INTER' : s.compound}
            </span>
          </motion.div>
        ))}
        {/* garis lap */}
        {Array.from({ length: Math.floor(totalLaps / 10) }).map((_, i) => (
          <span
            key={i}
            className="absolute inset-y-0 w-px bg-white/10"
            style={{ left: w((i + 1) * 10) }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export function StintChart({
  raceId,
  drivers,
}: {
  raceId: string;
  drivers: { id: string; code: string; name: string }[];
}) {
  const mode = useConsoleStore((s) => s.strategyMode);
  const setMode = useConsoleStore((s) => s.setStrategyMode);
  const teamColor = `var(--team-color)`;

  return (
    <section aria-label="Timeline strategi stint">
      <SectionTitle
        kicker="Langkah 4"
        title="TIMELINE STRATEGI STINT"
        description="Perbandingan visual antara stint yang benar-benar terjadi dan stint hasil prediksi model. Batang menggambar dirinya sendiri saat masuk viewport."
      >
        <Segmented
          ariaLabel="Mode tampilan stint"
          options={[
            { value: 'actual', label: 'Aktual' },
            { value: 'predicted', label: 'Prediksi' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </SectionTitle>

      <div className="space-y-8">
        {drivers.map((d) => (
          <StintBlock key={d.id} raceId={raceId} driver={d} mode={mode} teamColor={teamColor} />
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Catatan: versi “prediksi” adalah keluaran model per-lap yang dirangkum — karena model
        belum selesai dilatih, tampilan ini memakai data demo. Perbandingan ini bersifat
        observasional, bukan evaluasi akurasi.
      </p>
    </section>
  );
}

function StintBlock({
  raceId,
  driver,
  mode,
  teamColor,
}: {
  raceId: string;
  driver: { id: string; code: string; name: string };
  mode: 'actual' | 'predicted';
  teamColor: string;
}) {
  const { data, isLoading } = useStrategy(raceId, driver.id);
  const totalLaps =
    data && data.actual.length > 0 ? data.actual[data.actual.length - 1].endLap : 60;

  return (
    <motion.div layout transition={transition.smooth} className="surface-card p-5">
      <p className="mb-4 font-display text-2xl tracking-wide">
        <span style={{ color: teamColor }}>{driver.code}</span>{' '}
        <span className="text-sm font-sans font-normal text-muted">{driver.name}</span>
      </p>
      {isLoading || !data ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={transition.smooth}>
          <StintRow
            label={driver.code}
            color={teamColor}
            stints={mode === 'actual' ? data.actual : data.predicted}
            totalLaps={totalLaps}
            mode={mode}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
