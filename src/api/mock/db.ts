import type { Compound, Driver, Race, Team, TrackStatus } from '../types';

export const SEASONS = [2021, 2022, 2023, 2024, 2025];

export const TEAMS: Team[] = [
  { id: 'red-bull', name: 'Red Bull Racing', shortName: 'RBR', color: '#3671C6' },
  { id: 'ferrari', name: 'Scuderia Ferrari', shortName: 'FER', color: '#E8002D' },
  { id: 'mercedes', name: 'Mercedes-AMG F1', shortName: 'MER', color: '#27F4D2' },
  { id: 'mclaren', name: 'McLaren F1 Team', shortName: 'MCL', color: '#FF8000' },
  { id: 'aston-martin', name: 'Aston Martin Aramco', shortName: 'AM', color: '#229971' },
  { id: 'alpine', name: 'BWT Alpine F1', shortName: 'ALP', color: '#0093CC' },
  { id: 'williams', name: 'Williams Racing', shortName: 'WIL', color: '#64C4FF' },
  { id: 'rb', name: 'Visa Cash App RB', shortName: 'RB', color: '#6692FF' },
  { id: 'haas', name: 'MoneyGram Haas F1', shortName: 'HAA', color: '#B6BABD' },
  { id: 'sauber', name: 'Stake F1 Team Sauber', shortName: 'SAU', color: '#52E252' },
];

/** Lineup disederhanakan (satu lineup untuk semua musim demo — lihat README). */
export const DRIVERS: Driver[] = [
  { id: 'verstappen', code: 'VER', name: 'Max Verstappen', teamId: 'red-bull', number: 1 },
  { id: 'tsunoda', code: 'TSU', name: 'Yuki Tsunoda', teamId: 'red-bull', number: 22 },
  { id: 'leclerc', code: 'LEC', name: 'Charles Leclerc', teamId: 'ferrari', number: 16 },
  { id: 'hamilton', code: 'HAM', name: 'Lewis Hamilton', teamId: 'ferrari', number: 44 },
  { id: 'russell', code: 'RUS', name: 'George Russell', teamId: 'mercedes', number: 63 },
  { id: 'antonelli', code: 'ANT', name: 'Kimi Antonelli', teamId: 'mercedes', number: 12 },
  { id: 'norris', code: 'NOR', name: 'Lando Norris', teamId: 'mclaren', number: 4 },
  { id: 'piastri', code: 'PIA', name: 'Oscar Piastri', teamId: 'mclaren', number: 81 },
  { id: 'alonso', code: 'ALO', name: 'Fernando Alonso', teamId: 'aston-martin', number: 14 },
  { id: 'stroll', code: 'STR', name: 'Lance Stroll', teamId: 'aston-martin', number: 18 },
  { id: 'gasly', code: 'GAS', name: 'Pierre Gasly', teamId: 'alpine', number: 10 },
  { id: 'doohan', code: 'DOO', name: 'Jack Doohan', teamId: 'alpine', number: 7 },
  { id: 'albon', code: 'ALB', name: 'Alexander Albon', teamId: 'williams', number: 23 },
  { id: 'sainz', code: 'SAI', name: 'Carlos Sainz', teamId: 'williams', number: 55 },
  { id: 'hadjar', code: 'HAD', name: 'Isack Hadjar', teamId: 'rb', number: 6 },
  { id: 'lawson', code: 'LAW', name: 'Liam Lawson', teamId: 'rb', number: 30 },
  { id: 'ocon', code: 'OCO', name: 'Esteban Ocon', teamId: 'haas', number: 31 },
  { id: 'bearman', code: 'BEA', name: 'Oliver Bearman', teamId: 'haas', number: 87 },
  { id: 'hulkenberg', code: 'HUL', name: 'Nico Hulkenberg', teamId: 'sauber', number: 27 },
  { id: 'bortoleto', code: 'BOR', name: 'Gabriel Bortoleto', teamId: 'sauber', number: 5 },
];

interface CalendarEntry {
  slug: string;
  name: string;
  circuit: string;
  country: string;
  totalLaps: number;
  /** kandidat kuat balapan hujan (untuk kasus INTERMEDIATE/WET) */
  wetBias?: boolean;
}

const CALENDAR: CalendarEntry[] = [
  { slug: 'bahrain', name: 'Bahrain Grand Prix', circuit: 'Bahrain International Circuit', country: 'Bahrain', totalLaps: 57 },
  { slug: 'saudi-arabia', name: 'Saudi Arabian Grand Prix', circuit: 'Jeddah Corniche Circuit', country: 'Arab Saudi', totalLaps: 50 },
  { slug: 'australia', name: 'Australian Grand Prix', circuit: 'Albert Park Circuit', country: 'Australia', totalLaps: 58 },
  { slug: 'japan', name: 'Japanese Grand Prix', circuit: 'Suzuka International Racing Course', country: 'Jepang', totalLaps: 53 },
  { slug: 'miami', name: 'Miami Grand Prix', circuit: 'Miami International Autodrome', country: 'Amerika Serikat', totalLaps: 57 },
  { slug: 'monaco', name: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', country: 'Monako', totalLaps: 78 },
  { slug: 'spain', name: 'Spanish Grand Prix', circuit: 'Circuit de Barcelona-Catalunya', country: 'Spanyol', totalLaps: 66 },
  { slug: 'austria', name: 'Austrian Grand Prix', circuit: 'Red Bull Ring', country: 'Austria', totalLaps: 71 },
  { slug: 'britain', name: 'British Grand Prix', circuit: 'Silverstone Circuit', country: 'Inggris', totalLaps: 52 },
  { slug: 'brazil', name: 'São Paulo Grand Prix', circuit: 'Autódromo José Carlos Pace', country: 'Brasil', totalLaps: 71, wetBias: true },
  { slug: 'abu-dhabi', name: 'Abu Dhabi Grand Prix', circuit: 'Yas Marina Circuit', country: 'UEA', totalLaps: 58 },
];

export function racesForSeason(season: number): Race[] {
  return CALENDAR.map((c, i) => ({
    id: `${season}-${c.slug}`,
    season,
    round: i + 1,
    name: c.name,
    circuit: c.circuit,
    country: c.country,
    totalLaps: c.totalLaps,
  }));
}

export function getRaceById(raceId: string): Race | undefined {
  const [seasonStr, ...rest] = raceId.split('-');
  const season = Number(seasonStr);
  return racesForSeason(season).find((r) => r.id === raceId) ?? (rest.length ? undefined : undefined);
}

export const COMPOUND_COLORS: Record<Compound, string> = {
  SOFT: '#FF3333',
  MEDIUM: '#FFD12E',
  HARD: '#F0F0F0',
  INTERMEDIATE: '#39B54A',
  WET: '#0067DB',
};

export const COMPOUND_LETTER: Record<Compound, string> = {
  SOFT: 'S',
  MEDIUM: 'M',
  HARD: 'H',
  INTERMEDIATE: 'I',
  WET: 'W',
};

export const TRACK_STATUS_LABEL: Record<TrackStatus, string> = {
  GREEN: 'Lintasan hijau',
  SC: 'Safety Car',
  VSC: 'Virtual Safety Car',
  RED: 'Bendera merah',
};

/* ---------- utilitas RNG deterministik ---------- */

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
