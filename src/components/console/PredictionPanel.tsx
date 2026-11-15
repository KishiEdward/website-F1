import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import type { Compound, PredictionOutput } from '../../api/types';
import { COMPOUND_COLORS } from '../../api/mock/db';
import { TyreIcon } from '../ui/TyreIcon';
import { CountUp } from '../ui/CountUp';
import { ProgressRing } from '../ui/ProgressRing';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { Skeleton } from '../ui/Skeleton';
import { transition } from '../../motion';

interface Props {
  driverCode: string;
  driverName: string;
  teamColor: string;
  currentLap: number;
  prediction?: PredictionOutput;
  loading: boolean;
}

const COMPOUND_ORDER: Compound[] = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'];
const SHORT: Record<Compound, string> = {
  SOFT: 'S',
  MEDIUM: 'M',
  HARD: 'H',
  INTERMEDIATE: 'INT',
  WET: 'WET',
};

/** Panel hasil prediksi model untuk satu pembalap. */
export function PredictionPanel({
  driverCode,
  driverName,
  teamColor,
  currentLap,
  prediction,
  loading,
}: Props) {
  const chartData = prediction
    ? COMPOUND_ORDER.map((c) => ({
        name: SHORT[c],
        compound: c,
        value: Math.round((prediction.compoundProbabilities[c] ?? 0) * 100),
      }))
    : [];

  return (
    <motion.div
      layout
      transition={transition.smooth}
      className="surface-card team-tint relative overflow-hidden p-5"
      style={{ borderColor: `${teamColor}44` }}
      aria-label={`Panel prediksi ${driverName}`}
    >
      <span className="absolute inset-x-0 top-0 h-1 team-tint" style={{ backgroundColor: teamColor }} aria-hidden="true" />
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="font-display text-3xl leading-none tracking-wide">{driverCode}</p>
          <p className="mt-0.5 text-xs text-muted">{driverName}</p>
        </div>
        <p className="font-mono text-xs text-muted">
          LAP <span className="font-bold text-ink">{currentLap}</span>
        </p>
      </div>

      {loading || !prediction ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* laps remaining + ring */}
          <div className="flex items-center gap-4">
            <ProgressRing
              progress={Math.min(1, prediction.lapsRemaining / 35)}
              color={teamColor}
              label={`Prediksi ${prediction.lapsRemaining} lap lagi hingga pit`}
            >
              <span className="font-display text-4xl leading-none">
                <CountUp value={prediction.lapsRemaining} />
              </span>
              <span className="label-mono mt-0.5">lap lagi</span>
            </ProgressRing>
            <div>
              <p className="label-mono">Prediksi sisa lap sebelum pit</p>
              <p className="mt-1 text-sm text-muted">
                Window pit: <strong className="font-mono text-ink">lap {prediction.pitWindow.start}–{prediction.pitWindow.end}</strong>
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted/80">
                Prediksi berbasis kondisi lap ini (observasional).
              </p>
            </div>
          </div>

          {/* compound berikutnya */}
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface2/60 p-3">
            <TyreIcon compound={prediction.nextCompound} size={58} />
            <div className="flex-1">
              <p className="label-mono">Prediksi compound stint berikutnya</p>
              <p className="font-display text-2xl tracking-wide" style={{ color: COMPOUND_COLORS[prediction.nextCompound] }}>
                {prediction.nextCompound}
              </p>
            </div>
          </div>

          <ConfidenceBar value={prediction.confidence} color={teamColor} />

          {/* distribusi probabilitas */}
          <div>
            <p className="label-mono mb-1">Probabilitas per compound</p>
            <div className="h-24" role="img" aria-label="Grafik batang probabilitas compound">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 0, left: -28, bottom: -8 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9a9aa8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={{ stroke: '#26262f' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9a9aa8', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={500} isAnimationActive>
                    {chartData.map((d) => (
                      <Cell key={d.compound} fill={COMPOUND_COLORS[d.compound]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
