import type { ApiClient, Compound, PredictionInput, PredictionOutput } from './types';
import { DRIVERS, SEASONS, TEAMS, hashString, mulberry32, racesForSeason } from './mock/db';
import { findRace, getGenerated } from './mock/generate';

const delay = <T,>(value: T, ms = 150 + Math.random() * 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const STINT_BASE: Record<Compound, number> = {
  SOFT: 22,
  MEDIUM: 30,
  HARD: 40,
  INTERMEDIATE: 32,
  WET: 28,
};

function mockPredict(input: PredictionInput): PredictionOutput {
  const gen = getGenerated(input.raceId);
  const rng = mulberry32(hashString(`${input.raceId}|${input.driverId}|${input.lap}`));
  const totalLaps = gen.race.totalLaps;

  let lapsRemaining =
    STINT_BASE[input.compound] - input.tyreAge + Math.floor(rng() * 7) - 3;

  // pit lebih mungkin dipertahankan/diperpanjang di bawah SC/VSC
  if (input.trackStatus === 'SC') lapsRemaining += 3;
  if (input.trackStatus === 'VSC') lapsRemaining += 2;
  if (input.trackStatus === 'RED') lapsRemaining += 4;

  // balapan basah: ban slick harus segera diganti saat hujan masih turun
  const rainingNow = gen.isWet && input.lap <= gen.rainEndLap;
  const onSlicks = input.compound === 'SOFT' || input.compound === 'MEDIUM' || input.compound === 'HARD';
  if (rainingNow && onSlicks) lapsRemaining = 1 + Math.floor(rng() * 2);

  lapsRemaining = Math.max(1, Math.min(lapsRemaining, totalLaps - input.lap));

  // compound berikutnya
  let nextCompound: Compound;
  if (rainingNow) {
    nextCompound = input.lap < gen.rainEndLap * 0.4 ? 'WET' : 'INTERMEDIATE';
  } else if (gen.isWet && !rainingNow && (input.compound === 'WET' || input.compound === 'INTERMEDIATE')) {
    nextCompound = rng() < 0.6 ? 'MEDIUM' : 'HARD';
  } else {
    const late = input.lap / totalLaps;
    const pool: Compound[] = late > 0.65 ? ['HARD', 'MEDIUM', 'SOFT'] : late > 0.3 ? ['MEDIUM', 'HARD', 'SOFT'] : ['SOFT', 'MEDIUM', 'HARD'];
    const weights = [0.5 + rng() * 0.2, 0.3 + rng() * 0.2, 0.15 + rng() * 0.15];
    const total = weights.reduce((a, b) => a + b, 0);
    const r = rng() * total;
    nextCompound = r < weights[0] ? pool[0] : r < weights[0] + weights[1] ? pool[1] : pool[2];
  }

  // probabilitas per compound
  const probs = {} as Record<Compound, number>;
  (Object.keys(STINT_BASE) as Compound[]).forEach((c) => (probs[c] = 0));
  probs[nextCompound] = 0.55 + rng() * 0.35;
  const others = (Object.keys(STINT_BASE) as Compound[]).filter((c) => c !== nextCompound);
  let remainingProb = 1 - probs[nextCompound];
  others.forEach((c, i) => {
    const share = i === others.length - 1 ? remainingProb : remainingProb * (0.3 + rng() * 0.4);
    probs[c] = share;
    remainingProb -= share;
  });
  // normalisasi ringan
  const sum = (Object.values(probs) as number[]).reduce((a, b) => a + b, 0);
  (Object.keys(probs) as Compound[]).forEach((c) => (probs[c] = probs[c] / sum));

  const confidence = Math.round(probs[nextCompound] * (input.trackStatus === 'GREEN' ? 100 : 88));

  return {
    lapsRemaining,
    nextCompound,
    compoundProbabilities: probs,
    confidence,
    pitWindow: {
      start: input.lap + Math.max(1, lapsRemaining - 2),
      end: Math.min(totalLaps, input.lap + lapsRemaining + 2),
    },
  };
}

export const mockClient: ApiClient = {
  getTeams: () => delay(TEAMS),
  getDrivers: (teamId) => delay(DRIVERS.filter((d) => d.teamId === teamId)),
  getSeasons: () => delay(SEASONS, 80),
  getRaces: (season) => delay(racesForSeason(season)),
  getRaceLaps: (raceId) => {
    const gen = getGenerated(raceId);
    return delay({
      raceId,
      totalLaps: gen.race.totalLaps,
      driverIds: gen.driverIds,
      laps: gen.laps,
    }, 400);
  },
  getStrategy: (raceId, driverId) => {
    const gen = getGenerated(raceId);
    return delay({
      driverId,
      actual: gen.stints[driverId] ?? [],
      predicted: gen.predictedStints[driverId] ?? [],
    });
  },
  predict: (input) => {
    if (!findRace(input.raceId)) return Promise.reject(new Error(`Race tidak ditemukan: ${input.raceId}`));
    return delay(mockPredict(input), 220);
  },
};
