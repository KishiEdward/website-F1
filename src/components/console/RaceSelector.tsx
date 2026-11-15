import { motion } from 'framer-motion';
import { useRaces, useSeasons } from '../../hooks/queries';
import { useConsoleStore } from '../../store/useConsoleStore';
import { SectionTitle } from '../ui/SectionTitle';
import { Skeleton } from '../ui/Skeleton';

export function RaceSelector() {
  const { data: seasons, isLoading: seasonsLoading } = useSeasons();
  const season = useConsoleStore((s) => s.season);
  const raceId = useConsoleStore((s) => s.raceId);
  const setSeason = useConsoleStore((s) => s.setSeason);
  const setRace = useConsoleStore((s) => s.setRace);
  const { data: races, isLoading: racesLoading } = useRaces(season);

  return (
    <section aria-label="Pilih musim dan Grand Prix">
      <SectionTitle kicker="Langkah 2" title="MUSIM & GRAND PRIX" />
      {seasonsLoading ? (
        <Skeleton className="h-12 w-full max-w-md" />
      ) : (
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Pilih musim"
        >
          {seasons?.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={s === season}
              onClick={() => setSeason(s)}
              className={`rounded-xl border px-5 py-2.5 font-display text-2xl tracking-wide transition-all duration-300 ${
                s === season
                  ? 'border-accent bg-accent/15 text-ink shadow-glow'
                  : 'border-line bg-surface text-muted hover:border-muted/50 hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
        {racesLoading ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="listbox" aria-label="Daftar Grand Prix">
            {races?.map((r) => {
              const active = r.id === raceId;
              return (
                <motion.button
                  key={r.id}
                  role="option"
                  aria-selected={active}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRace(r.id, r.totalLaps)}
                  className={`rounded-2xl border p-4 text-left transition-colors duration-300 ${
                    active
                      ? 'border-accent bg-accent/10'
                      : 'border-line bg-surface hover:border-muted/40'
                  }`}
                >
                  <span className="label-mono">Ronde {r.round}</span>
                  <span className="mt-0.5 block font-display text-2xl leading-none tracking-wide">
                    {r.name.replace(' Grand Prix', '')} <span className="text-accent">GP</span>
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-muted">
                    {r.circuit} · {r.totalLaps} lap
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
