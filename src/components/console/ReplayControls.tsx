import { motion } from 'framer-motion';
import { useConsoleStore, type Speed } from '../../store/useConsoleStore';
import { transition } from '../../motion';

interface Props {
  totalLaps: number;
}

const speeds: Speed[] = [1, 2, 4];

export function ReplayControls({ totalLaps }: Props) {
  const currentLap = useConsoleStore((s) => s.currentLap);
  const isPlaying = useConsoleStore((s) => s.isPlaying);
  const speed = useConsoleStore((s) => s.speed);
  const togglePlay = useConsoleStore((s) => s.togglePlay);
  const setLap = useConsoleStore((s) => s.setLap);
  const setSpeed = useConsoleStore((s) => s.setSpeed);

  const atEnd = currentLap >= totalLaps;
  const fill = ((currentLap - 1) / Math.max(1, totalLaps - 1)) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={transition.snappy}
          onClick={togglePlay}
          disabled={atEnd && !isPlaying}
          aria-label={isPlaying ? 'Jeda replay' : atEnd ? ' Replay selesai' : 'Putar replay'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-glow transition-opacity disabled:opacity-40"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : atEnd ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 5v14l-9-7 9-7z" transform="rotate(180 12 12)" />
              <path d="M5 4l12 8-12 8V4z" />
              <path d="M19 4v16h-2V4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          )}
        </motion.button>

        <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1" role="group" aria-label="Kecepatan replay">
          {speeds.map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeed(sp)}
              aria-pressed={speed === sp}
              aria-label={`Kecepatan ${sp} kali`}
              className={`relative rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                speed === sp ? 'text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {speed === sp && (
                <motion.span
                  layoutId="speed-pill"
                  className="absolute inset-0 rounded-lg bg-surface2 ring-1 ring-accent/60"
                  transition={transition.spring}
                />
              )}
              <span className="relative z-10">{sp}x</span>
            </button>
          ))}
        </div>

        <p className="font-mono text-sm text-muted" aria-live="polite">
          LAP <span className="text-2xl font-bold text-ink">{currentLap}</span>
          <span className="text-muted"> / {totalLaps}</span>
        </p>
      </div>

      <input
        type="range"
        className="scrubber"
        min={1}
        max={totalLaps}
        step={1}
        value={currentLap}
        onChange={(e) => setLap(Number(e.target.value))}
        style={{ ['--fill' as string]: `${fill}%` }}
        aria-label="Geser untuk memilih lap"
        aria-valuetext={`Lap ${currentLap} dari ${totalLaps}`}
      />
    </div>
  );
}
