import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Driver, Race, TrackStatus } from '../../api/types';
import { useRaceLaps, usePrediction } from '../../hooks/queries';
import { useConsoleStore } from '../../store/useConsoleStore';
import { useReplayEngine } from '../../hooks/useReplayEngine';
import { ReplayControls } from './ReplayControls';
import { TimelineStrip } from './TimelineStrip';
import { PredictionPanel } from './PredictionPanel';
import { SCOverlay } from './SCOverlay';
import { TrackStatusBadge } from '../ui/TrackStatusBadge';
import { TyreIcon } from '../ui/TyreIcon';
import { Skeleton } from '../ui/Skeleton';
import { LIVE_ENABLED } from '../../api/client';
import { LivePanel } from './LivePanel';
import { container, fadeUp, transition } from '../../motion';

interface Props {
  race: Race;
  drivers: Driver[];
  teamColor: string;
}

function DriverLapCard({
  driver,
  position,
  compound,
  tyreAge,
  status,
  color,
}: {
  driver: Driver;
  position: number;
  compound: Parameters<typeof TyreIcon>[0]['compound'];
  tyreAge: number;
  status: TrackStatus;
  color: string;
}) {
  return (
    <motion.div layout transition={transition.smooth} className="surface-card team-tint flex items-center gap-4 p-4" style={{ borderColor: `${color}33` }}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface2 font-display text-3xl" style={{ color }}>
        P{position}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-2xl leading-none tracking-wide">{driver.code}</p>
        <p className="mt-1 truncate text-xs text-muted">{driver.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
          <span>
            UMUR BAN <strong className="text-ink">{tyreAge}</strong> lap
          </span>
          <TrackStatusBadge status={status} />
        </div>
      </div>
      <TyreIcon compound={compound} size={52} label={`Compound saat ini: ${compound}`} />
    </motion.div>
  );
}

function DriverPredictionColumn({
  race,
  driver,
  teamColor,
  live,
}: {
  race: Race;
  driver: Driver;
  teamColor: string;
  live: boolean;
}) {
  const currentLap = useConsoleStore((s) => s.currentLap);
  const { data: raceLaps } = useRaceLaps(race.id, live);

  const entry = raceLaps?.laps[driver.id]?.[currentLap - 1];

  const input = useMemo(
    () =>
      entry
        ? {
            season: race.season,
            raceId: race.id,
            driverId: driver.id,
            lap: currentLap,
            compound: entry.compound,
            tyreAge: entry.tyreAge,
            trackStatus: entry.trackStatus,
            position: entry.position,
          }
        : null,
    [entry, race.id, race.season, driver.id, currentLap],
  );

  const { data: prediction, isLoading } = usePrediction(input);

  return (
    <div className="space-y-3">
      {entry ? (
        <DriverLapCard
          driver={driver}
          position={entry.position}
          compound={entry.compound}
          tyreAge={entry.tyreAge}
          status={entry.trackStatus}
          color={teamColor}
        />
      ) : (
        <Skeleton className="h-24 w-full" />
      )}
      <PredictionPanel
        driverCode={driver.code}
        driverName={driver.name}
        teamColor={teamColor}
        currentLap={currentLap}
        prediction={prediction}
        loading={isLoading && !prediction}
      />
    </div>
  );
}

export function ReplaySection({ race, drivers, teamColor }: Props) {
  const currentLap = useConsoleStore((s) => s.currentLap);
  const liveEnabled = useConsoleStore((s) => s.liveEnabled);
  const live = LIVE_ENABLED && liveEnabled;
  const { data: raceLaps, isLoading } = useRaceLaps(race.id, live);
  useReplayEngine(race.totalLaps);

  const trackStatus = useMemo<TrackStatus[]>(() => {
    const arr: TrackStatus[] = new Array(race.totalLaps + 1).fill('GREEN');
    const first = drivers[0];
    if (raceLaps && first) {
      raceLaps.laps[first.id]?.forEach((l) => (arr[l.lap] = l.trackStatus));
    }
    return arr;
  }, [raceLaps, drivers, race.totalLaps]);

  const currentStatus: TrackStatus = trackStatus[currentLap] ?? 'GREEN';

  const strips = useMemo(() => {
    if (!raceLaps) return [];
    return drivers.map((d) => ({
      driverCode: d.code,
      laps: raceLaps.laps[d.id] ?? [],
      totalLaps: race.totalLaps,
      currentLap,
      color: teamColor,
    }));
  }, [raceLaps, drivers, race.totalLaps, currentLap, teamColor]);

  return (
    <section aria-label="Replay balapan dan prediksi">
      <motion.div
        variants={container()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono text-accent">Langkah 3 · Replay</p>
            <h2 className="font-display text-4xl leading-none tracking-wide sm:text-5xl">
              {race.name.toUpperCase()} <span className="text-muted">{race.season}</span>
            </h2>
            <p className="mt-2 font-mono text-xs text-muted">
              {race.circuit} · {race.totalLaps} lap · {drivers.length} pembalap dipilih
            </p>
          </div>
          {LIVE_ENABLED && <LivePanel />}
        </motion.div>

        {isLoading || !raceLaps ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <motion.div variants={fadeUp} className="surface-card mb-4 p-5">
              <SCOverlay status={currentStatus} />
              <div className={currentStatus !== 'GREEN' ? 'mt-4' : ''}>
                <ReplayControls totalLaps={race.totalLaps} />
              </div>
              <div className="mt-6">
                <TimelineStrip
                  strips={strips}
                  trackStatus={trackStatus}
                  totalLaps={race.totalLaps}
                  currentLap={currentLap}
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
              {drivers.map((d) => (
                <DriverPredictionColumn
                  key={d.id}
                  race={race}
                  driver={d}
                  teamColor={teamColor}
                  live={live}
                />
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </section>
  );
}
