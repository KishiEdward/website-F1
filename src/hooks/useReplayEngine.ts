import { useEffect } from 'react';
import { useConsoleStore } from '../store/useConsoleStore';

/**
 * Mesin replay: memajukan lap saat isPlaying, dengan interval sesuai speed.
 * Berhenti otomatis di lap terakhir.
 */
export function useReplayEngine(totalLaps: number) {
  const isPlaying = useConsoleStore((s) => s.isPlaying);
  const speed = useConsoleStore((s) => s.speed);
  const currentLap = useConsoleStore((s) => s.currentLap);
  const setLap = useConsoleStore((s) => s.setLap);
  const setPlaying = useConsoleStore((s) => s.setPlaying);

  useEffect(() => {
    if (!isPlaying || totalLaps <= 0) return;
    const intervalMs = 1400 / speed;
    const id = window.setInterval(() => {
      const state = useConsoleStore.getState();
      if (state.currentLap >= totalLaps) {
        state.setPlaying(false);
        return;
      }
      state.setLap(state.currentLap + 1);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, totalLaps]);

  useEffect(() => {
    if (currentLap >= totalLaps && totalLaps > 0 && isPlaying) setPlaying(false);
  }, [currentLap, totalLaps, isPlaying, setPlaying]);

  const restart = () => {
    setLap(1);
    setPlaying(true);
  };

  return { restart };
}
