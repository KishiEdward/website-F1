import type { Compound, Driver, LapEntry, Race, Stint, TrackStatus } from '../types';
import { DRIVERS, hashString, mulberry32, racesForSeason } from './db';

export interface GeneratedRace {
  race: Race;
  isWet: boolean;
  /** lap terakhir kondisi hujan (untuk balapan basah) */
  rainEndLap: number;
  trackStatus: TrackStatus[]; // index 1..totalLaps
  laps: Record<string, LapEntry[]>;
  stints: Record<string, Stint[]>;
  predictedStints: Record<string, Stint[]>;
  driverIds: string[];
}

const cache = new Map<string, GeneratedRace>();

export function findRace(raceId: string): Race | undefined {
  const season = Number(raceId.split('-')[0]);
  if (!season) return undefined;
  return racesForSeason(season).find((r) => r.id === raceId);
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function planDryStints(rng: () => number, totalLaps: number): Stint[] {
  const stops = rng() < 0.55 ? 1 : 2;
  const patterns1: Compound[][] = [
    ['MEDIUM', 'HARD'],
    ['SOFT', 'MEDIUM'],
    ['SOFT', 'HARD'],
    ['MEDIUM', 'SOFT'],
    ['HARD', 'MEDIUM'],
  ];
  const patterns2: Compound[][] = [
    ['SOFT', 'MEDIUM', 'HARD'],
    ['SOFT', 'HARD', 'MEDIUM'],
    ['MEDIUM', 'HARD', 'SOFT'],
    ['MEDIUM', 'SOFT', 'HARD'],
  ];
  const compounds = stops === 1 ? pick(rng, patterns1) : pick(rng, patterns2);

  const boundaries: number[] = [];
  if (stops === 1) {
    boundaries.push(Math.round(totalLaps * (0.42 + rng() * 0.14)));
  } else {
    const first = Math.round(totalLaps * (0.28 + rng() * 0.1));
    const second = first + Math.round((totalLaps - first) * (0.42 + rng() * 0.16));
    boundaries.push(first, second);
  }

  const stints: Stint[] = [];
  let start = 1;
  boundaries.forEach((b, i) => {
    stints.push({ startLap: start, endLap: b, compound: compounds[i] });
    start = b + 1;
  });
  stints.push({ startLap: start, endLap: totalLaps, compound: compounds[compounds.length - 1] });
  return stints;
}

function planWetStints(rng: () => number, totalLaps: number, rainEndLap: number): Stint[] {
  const stints: Stint[] = [];
  let start = 1;
  const firstCompound: Compound = rng() < 0.5 ? 'WET' : 'INTERMEDIATE';
  const firstEnd = clamp(Math.round(rainEndLap * (0.3 + rng() * 0.25)), 5, totalLaps - 20);
  stints.push({ startLap: start, endLap: firstEnd, compound: firstCompound });
  start = firstEnd + 1;

  const interEnd = clamp(rainEndLap + Math.round(rng() * 6), start + 4, totalLaps - 12);
  stints.push({ startLap: start, endLap: interEnd, compound: 'INTERMEDIATE' });
  start = interEnd + 1;

  const slick: Compound = rng() < 0.6 ? 'MEDIUM' : 'HARD';
  const remaining = totalLaps - start + 1;
  if (remaining > 30 && rng() < 0.55) {
    const mid = start + Math.round(remaining * (0.45 + rng() * 0.12));
    const second: Compound = slick === 'MEDIUM' ? 'HARD' : 'MEDIUM';
    stints.push({ startLap: start, endLap: mid, compound: slick });
    stints.push({ startLap: mid + 1, endLap: totalLaps, compound: second });
  } else {
    stints.push({ startLap: start, endLap: totalLaps, compound: slick });
  }
  return stints;
}

/** Geser window pit + sesuaikan compound → "prediksi" strategi untuk perbandingan. */
function planPredicted(rng: () => number, actual: Stint[], totalLaps: number): Stint[] {
  if (actual.length < 2) return actual.map((s) => ({ ...s }));
  const delta = Math.floor(rng() * 7) - 3; // -3..+3 lap
  const firstEnd = clamp(actual[0].endLap + delta, 5, totalLaps - 10);

  let firstCompound = actual[0].compound;
  if (rng() < 0.35) {
    const alts: Compound[] = (['SOFT', 'MEDIUM', 'HARD'] as Compound[]).filter(
      (c) => c !== firstCompound && actual[0].compound !== 'WET' && actual[0].compound !== 'INTERMEDIATE',
    );
    if (alts.length > 0) firstCompound = pick(rng, alts);
  }

  const stints: Stint[] = [{ startLap: 1, endLap: firstEnd, compound: firstCompound }];
  const rest = actual.slice(1);
  const restTotal = rest.reduce((acc, s) => acc + (s.endLap - s.startLap + 1), 0);
  let start = firstEnd + 1;
  rest.forEach((s, i) => {
    const len = i === rest.length - 1 ? totalLaps - start + 1 : Math.max(4, Math.round(((s.endLap - s.startLap + 1) / restTotal) * (totalLaps - firstEnd)));
    const end = i === rest.length - 1 ? totalLaps : clamp(start + len - 1, start + 3, totalLaps - 1);
    let compound = s.compound;
    if (rng() < 0.3 && compound !== 'WET' && compound !== 'INTERMEDIATE') {
      const swap: Record<string, Compound> = { SOFT: 'MEDIUM', MEDIUM: 'HARD', HARD: 'MEDIUM' };
      compound = swap[compound] ?? compound;
    }
    stints.push({ startLap: start, endLap: end, compound });
    start = end + 1;
  });
  return stints;
}

function stintsToLaps(stints: Stint[], driverId: string, trackStatus: TrackStatus[]): LapEntry[] {
  const laps: LapEntry[] = [];
  stints.forEach((stint, si) => {
    for (let lap = stint.startLap; lap <= stint.endLap; lap++) {
      laps.push({
        lap,
        driverId,
        position: 0, // diisi setelah semua pembalap dibuat
        compound: stint.compound,
        tyreAge: lap - stint.startLap,
        trackStatus: trackStatus[lap] ?? 'GREEN',
        pitted: si > 0 && lap === stint.startLap,
      });
    }
  });
  return laps;
}

function buildTrackStatus(rng: () => number, totalLaps: number, isWet: boolean): TrackStatus[] {
  const status: TrackStatus[] = new Array(totalLaps + 1).fill('GREEN');
  if (isWet) {
    const scEnd = clamp(2 + Math.floor(rng() * 4), 1, Math.min(8, totalLaps));
    for (let l = 1; l <= scEnd; l++) status[l] = 'SC';
  }
  if (rng() < 0.6) {
    const s = 12 + Math.floor(rng() * Math.max(5, totalLaps - 30));
    const len = 3 + Math.floor(rng() * 3);
    for (let l = s; l <= Math.min(s + len, totalLaps); l++) if (status[l] === 'GREEN') status[l] = 'SC';
  }
  if (rng() < 0.45) {
    const s = 15 + Math.floor(rng() * Math.max(5, totalLaps - 30));
    const len = 2 + Math.floor(rng() * 3);
    for (let l = s; l <= Math.min(s + len, totalLaps); l++) if (status[l] === 'GREEN') status[l] = 'VSC';
  }
  if (rng() < 0.08) {
    const s = 20 + Math.floor(rng() * Math.max(5, totalLaps - 40));
    for (let l = s; l <= Math.min(s + 1, totalLaps); l++) status[l] = 'RED';
  }
  return status;
}

function generate(race: Race): GeneratedRace {
  const rng = mulberry32(hashString(race.id));
  const totalLaps = race.totalLaps;
  const isWet = race.id.includes('brazil') ? true : rng() < 0.12;
  const rainEndLap = isWet ? clamp(Math.round(totalLaps * (0.25 + rng() * 0.3)), 8, totalLaps - 15) : 0;

  const trackStatus = buildTrackStatus(rng, totalLaps, isWet);

  const drivers: Driver[] = DRIVERS;
  const stints: Record<string, Stint[]> = {};
  const predictedStints: Record<string, Stint[]> = {};
  const laps: Record<string, LapEntry[]> = {};

  // skill dasar: tim kuat sedikit lebih cepat (hanya untuk variasi posisi, tetap data demo)
  const teamStrength: Record<string, number> = {
    'red-bull': 0.9, mclaren: 0.88, ferrari: 0.86, mercedes: 0.84,
    'aston-martin': 0.7, alpine: 0.66, williams: 0.68, rb: 0.62, haas: 0.6, sauber: 0.58,
  };

  const skill: Record<string, number> = {};
  drivers.forEach((d) => {
    skill[d.id] = (teamStrength[d.teamId] ?? 0.6) + (rng() - 0.5) * 0.25;
  });

  drivers.forEach((d) => {
    stints[d.id] = isWet ? planWetStints(rng, totalLaps, rainEndLap) : planDryStints(rng, totalLaps);
    predictedStints[d.id] = planPredicted(rng, stints[d.id], totalLaps);
    laps[d.id] = stintsToLaps(stints[d.id], d.id, trackStatus);
  });

  // posisi per lap: urutkan berdasarkan skill + degradasi ban + noise
  const degIdeal: Record<Compound, number> = { SOFT: 20, MEDIUM: 30, HARD: 42, INTERMEDIATE: 35, WET: 30 };
  for (let lap = 1; lap <= totalLaps; lap++) {
    const scored = drivers.map((d) => {
      const entry = laps[d.id][lap - 1];
      const deg = entry ? Math.pow(entry.tyreAge / degIdeal[entry.compound], 2) * 0.6 : 0;
      const wetPenalty =
        isWet && entry && lap <= rainEndLap
          ? entry.compound === 'WET' || entry.compound === 'INTERMEDIATE'
            ? 0
            : 1.5
          : 0;
      const noise = Math.sin(lap * 0.7 + hashString(d.id) % 13) * 0.08;
      return { id: d.id, score: skill[d.id] - deg - wetPenalty + noise };
    });
    scored.sort((a, b) => b.score - a.score);
    scored.forEach((s, i) => {
      laps[s.id][lap - 1].position = i + 1;
    });
  }

  const driverIds = drivers
    .map((d) => d.id)
    .sort((a, b) => (laps[a][totalLaps - 1]?.position ?? 99) - (laps[b][totalLaps - 1]?.position ?? 99));

  return { race, isWet, rainEndLap, trackStatus, laps, stints, predictedStints, driverIds };
}

export function getGenerated(raceId: string): GeneratedRace {
  let gen = cache.get(raceId);
  if (!gen) {
    const race = findRace(raceId);
    if (!race) throw new Error(`Race tidak ditemukan: ${raceId}`);
    gen = generate(race);
    cache.set(raceId, gen);
  }
  return gen;
}
