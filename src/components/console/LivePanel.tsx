import { motion } from 'framer-motion';
import { useConsoleStore } from '../../store/useConsoleStore';
import { transition } from '../../motion';

/**
 * Mode Live (feature-flag VITE_ENABLE_LIVE).
 * Komponen siap menerima stream: saat aktif, TanStack Query melakukan polling
 * ke endpoint lap (di API asli bisa diarahkan ke WebSocket/SSE tanpa mengubah UI).
 */
export function LivePanel() {
  const liveEnabled = useConsoleStore((s) => s.liveEnabled);
  const setLiveEnabled = useConsoleStore((s) => s.setLiveEnabled);

  return (
    <button
      onClick={() => setLiveEnabled(!liveEnabled)}
      aria-pressed={liveEnabled}
      aria-label={liveEnabled ? 'Matikan mode live' : 'Nyalakan mode live'}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
        liveEnabled
          ? 'border-red/60 bg-red/10 text-red'
          : 'border-line bg-surface text-muted hover:text-ink'
      }`}
    >
      <motion.span
        className={`h-2 w-2 rounded-full ${liveEnabled ? 'bg-red' : 'bg-muted'}`}
        animate={liveEnabled ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {liveEnabled ? 'Live · polling aktif' : 'Live (nonaktif)'}
      <motion.span layout transition={transition.snappy} />
    </button>
  );
}
