import { AnimatePresence, motion } from 'framer-motion';
import type { TrackStatus } from '../../api/types';
import { TRACK_STATUS_LABEL } from '../../api/mock/db';

const banner: Record<Exclude<TrackStatus, 'GREEN'>, { bg: string; text: string }> = {
  SC: { bg: 'rgba(255,176,32,0.14)', text: '#FFB020' },
  VSC: { bg: 'rgba(255,214,107,0.12)', text: '#FFD66B' },
  RED: { bg: 'rgba(255,45,45,0.16)', text: '#FF2D2D' },
};

/** Banner/overlay animatif saat status lintasan bukan hijau. */
export function SCOverlay({ status }: { status: TrackStatus }) {
  const active = status !== 'GREEN';
  const cfg = active ? banner[status as Exclude<TrackStatus, 'GREEN'>] : null;

  return (
    <AnimatePresence>
      {active && cfg && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative overflow-hidden rounded-xl border"
          style={{ backgroundColor: cfg.bg, borderColor: `${cfg.text}55` }}
          role="status"
          aria-live="assertive"
        >
          <div className="sc-stripes absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex items-center gap-3 px-4 py-3">
            <motion.span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: cfg.text }}
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <p className="font-display text-2xl leading-none tracking-wide" style={{ color: cfg.text }}>
              {TRACK_STATUS_LABEL[status]}
            </p>
            <p className="ml-auto hidden text-xs text-muted sm:block">
              Prediksi model ikut menyesuaikan selama neutralisasi
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
