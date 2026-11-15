import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDrivers, useRaces, useTeams } from '../hooks/queries';
import { useConsoleStore } from '../store/useConsoleStore';
import { TeamSelector } from '../components/console/TeamSelector';
import { DriverCards } from '../components/console/DriverCards';
import { RaceSelector } from '../components/console/RaceSelector';
import { ReplaySection } from '../components/console/ReplaySection';
import { StintChart } from '../components/console/StintChart';
import { IS_MOCK } from '../api/client';
import { fadeUp } from '../motion';

export default function Console() {
  const teamId = useConsoleStore((s) => s.teamId);
  const driverIds = useConsoleStore((s) => s.driverIds);
  const season = useConsoleStore((s) => s.season);
  const raceId = useConsoleStore((s) => s.raceId);

  const { data: teams } = useTeams();
  const { data: allDrivers } = useDrivers(teamId);
  const { data: races } = useRaces(season);

  const team = teams?.find((t) => t.id === teamId);
  const race = races?.find((r) => r.id === raceId);
  const drivers = useMemo(
    () => (allDrivers ?? []).filter((d) => driverIds.includes(d.id)),
    [allDrivers, driverIds],
  );

  /* warna tim dinamis lewat CSS variable, bertransisi halus (lihat .team-tint) */
  useEffect(() => {
    document.documentElement.style.setProperty('--team-color', team?.color ?? '#e10600');
  }, [team?.color]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-10">
        <p className="label-mono text-accent">Konsol Prediksi</p>
        <h1 className="mt-1 font-display text-5xl leading-none tracking-wide sm:text-7xl">
          BACA BALAPAN, <span className="text-accent">LAP DEMI LAP</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Seluruh keluaran di halaman ini adalah <strong className="text-ink">prediksi</strong>{' '}
          model hybrid XGBoost–LSTM yang dilatih dari keputusan balapan aktual (observasional) —
          bukan rekomendasi atau strategi optimal secara matematis.
          {IS_MOCK && (
            <span className="ml-1 inline-block rounded-full border border-medium/40 bg-medium/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-medium">
              Data demo
            </span>
          )}
        </p>
      </motion.div>

      <div className="space-y-16">
        <div>
          <TeamSelector />
          <DriverCards />
        </div>

        <RaceSelector />

        {race && drivers.length > 0 && team ? (
          <>
            <ReplaySection race={race} drivers={drivers} teamColor={team.color} />
            <StintChart
              raceId={race.id}
              drivers={drivers.map((d) => ({ id: d.id, code: d.code, name: d.name }))}
            />
          </>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="surface-card flex flex-col items-center gap-3 border-dashed p-12 text-center"
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="var(--muted)" strokeWidth="1.6" strokeDasharray="4 3" />
              <path d="M12 7v5l3 3" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p className="font-display text-3xl tracking-wide text-muted">
              {team ? 'PILIH MUSIM & GRAND PRIX' : 'PILIH TIM UNTUK MEMULAI'}
            </p>
            <p className="max-w-sm text-sm text-muted/80">
              Replay lap-by-lap dan panel prediksi akan muncul di sini setelah tim dan balapan dipilih.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
