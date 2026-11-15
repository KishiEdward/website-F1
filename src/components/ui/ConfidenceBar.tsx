import { motion } from 'framer-motion';
import { transition } from '../../motion';

interface Props {
  /** 0..100 */
  value: number;
  color?: string;
  label?: string;
}

export function ConfidenceBar({ value, color = 'var(--accent)', label = 'Keyakinan model' }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div aria-label={`${label}: ${clamped}%`} role="meter" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-xs font-bold text-ink">{clamped}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface2">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={false}
          animate={{ scaleX: clamped / 100 }}
          transition={{ ...transition.smooth, duration: 0.6 }}
        />
      </div>
    </div>
  );
}
