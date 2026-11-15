export type Compound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';
export type TrackStatus = 'GREEN' | 'SC' | 'VSC' | 'RED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Driver {
  id: string;
  code: string;
  name: string;
  teamId: string;
  number: number;
}

export interface Race {
  id: string;
  season: number;
  round: number;
  name: string;
  circuit: string;
  country: string;
  totalLaps: number;
}

export interface LapEntry {
  lap: number;
  driverId: string;
  position: number;
  compound: Compound;
  tyreAge: number;
  trackStatus: TrackStatus;
  /** true pada lap pembalap masuk pit (awal stint selain stint pertama) */
  pitted: boolean;
}

export interface RaceLaps {
  raceId: string;
  totalLaps: number;
  driverIds: string[];
  /** key = driverId, value = daftar lap terurut 1..totalLaps */
  laps: Record<string, LapEntry[]>;
}

export interface Stint {
  startLap: number;
  endLap: number;
  compound: Compound;
}

export interface DriverStrategy {
  driverId: string;
  actual: Stint[];
  predicted: Stint[];
}

export interface PredictionInput {
  season: number;
  raceId: string;
  driverId: string;
  lap: number;
  compound: Compound;
  tyreAge: number;
  trackStatus: TrackStatus;
  position: number;
}

export interface PredictionOutput {
  lapsRemaining: number;
  nextCompound: Compound;
  compoundProbabilities: Record<Compound, number>;
  confidence: number;
  pitWindow: { start: number; end: number };
}

export interface ApiClient {
  getTeams(): Promise<Team[]>;
  getDrivers(teamId: string): Promise<Driver[]>;
  getSeasons(): Promise<number[]>;
  getRaces(season: number): Promise<Race[]>;
  getRaceLaps(raceId: string): Promise<RaceLaps>;
  getStrategy(raceId: string, driverId: string): Promise<DriverStrategy>;
  predict(input: PredictionInput): Promise<PredictionOutput>;
}
