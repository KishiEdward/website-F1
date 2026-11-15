import { motion } from 'framer-motion';
import type { LapEntry, PredictionOutput, TrackStatus } from '../../api/types';
import { COMPOUND_COLORS } from '../../api/mock/db';
import { transition } from '../../motion';

interface DriverStripProps {
  driverCode: string;
  laps: LapEntry[];
  totalLaps: number;
  currentLap: number;
  prediction?: PredictionOutput;
  color: string;
}

const statusColor: Record<TrackStatus, string> = {
  GREEN: '#2a2a35',
  SC: '#FFB020',
  VSC: '#FFD66B',
  RED: '#FF2D2D',
};

function DriverStrip({ driverCode, laps, totalLaps, currentLap, prediction, color }: DriverStripProps) {
  const w = (n: number) => `${(n / totalLaps) * 100}%`;
  return (
    <div className="relative">
      <div className="label-mono mb-1 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {driverCode}
        {prediction && (
          <span className="normal-case tracking-normal text-muted">
            · window pit prediksi lap {prediction.pitWindow.start}–{prediction.pitWindow.end}
          </span>
        )}
      </div>
      <div className="relative h-7 overflow-hidden rounded-md border border-line bg-surface2">
        {/* segmen compound per lap */}
        {laps.map((l) => (
          <div
            key={l.lap}
            className="absolute inset-y-0"
            style={{
              left: w(l.lap - 1),
              width: w(1),
              backgroundColor: COMPOUND_COLORS[l.compound],
              opacity: l.lap <= currentLap ? 0.85 : 0.14,
            }}
            title={`Lap ${l.lap}: ${l.compound}`}
          />
        ))}
        {/* marker pit aktual */}
        {laps
          .filter((l) => l.pitted)
          .map((l) => (
            <div
              key={`pit-${l.lap}`}
              className="absolute -top-0.5 z-10"
              style={{ left: w(l.lap - 1) }}
              title={`Pit stop lap ${l.lap}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M6 1 L11 10 H1 Z" fill="#fff" stroke="#000" strokeWidth="0.6" />
              </svg>
            </div>
          ))}
        {/* band window pit prediksi */}
        {prediction && (
          <motion.div
            className="absolute inset-y-0 z-[5] border-x-2 border-dashed border-white/80 bg-white/15"
            style={{ left: w(prediction.pitWindow.start - 1), width: w(prediction.pitWindow.end - prediction.pitWindow.start + 1) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition.smooth}
            title="Jendela pit prediksi"
          />
        )}
        {/* kursor lap berjalan */}
        <motion.div
          className="absolute inset-y-0 z-20 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          animate={{ left: w(currentLap - 0.5) }}
          transition={{ ...transition.snappy, duration: 0.25 }}
        />
      </div>
    </div>
  );
}

interface Props {
  strips: DriverStripProps[];
  trackStatus: TrackStatus[];
  totalLaps: number;
  currentLap: number;
}

export function TimelineStrip({ strips, trackStatus, totalLaps, currentLap }: Props) {
  const w = (n: number) => `${(n / totalLaps) * 100}%`;
  return (
    <div className="space-y-4">
      {/* baris status lintasan */}
      <div>
        <p className="label-mono mb-1">Status lintasan</p>
        <div className="relative h-3 overflow-hidden rounded-sm border border-line">
          {trackStatus.slice(1, totalLaps + 1).map((s, i) => (
            <div
              key={i}
              className="absolute inset-y-0"
              style={{ left: w(i), width: w(1), backgroundColor: statusColor[s] }}
              title={`Lap ${i + 1}: ${s}`}
            />
          ))}
          <motion.div
            className="absolute inset-y-0 z-10 w-0.5 bg-white"
            animate={{ left: w(currentLap - 0.5) }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>
      {strips.map((s) => (
        <DriverStrip key={s.driverCode} {...s} />
      ))}
    </div>
  );
}
