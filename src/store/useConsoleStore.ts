import { create } from 'zustand';

export type Speed = 1 | 2 | 4;
export type StrategyMode = 'actual' | 'predicted';

interface ConsoleState {
  teamId: string | null;
  driverIds: string[];
  season: number;
  raceId: string | null;

  currentLap: number;
  isPlaying: boolean;
  speed: Speed;

  strategyMode: StrategyMode;
  liveEnabled: boolean;

  setTeam: (teamId: string, driverIds: string[]) => void;
  setSeason: (season: number) => void;
  setRace: (raceId: string, totalLaps: number) => void;
  setLap: (lap: number) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: Speed) => void;
  setStrategyMode: (mode: StrategyMode) => void;
  setLiveEnabled: (on: boolean) => void;
}

export const useConsoleStore = create<ConsoleState>()((set) => ({
  teamId: null,
  driverIds: [],
  season: 2024,
  raceId: null,

  currentLap: 1,
  isPlaying: false,
  speed: 1,

  strategyMode: 'actual',
  liveEnabled: false,

  setTeam: (teamId, driverIds) =>
    set({ teamId, driverIds, isPlaying: false, currentLap: 1 }),
  setSeason: (season) => set({ season, raceId: null, isPlaying: false, currentLap: 1 }),
  setRace: (raceId) => set({ raceId, isPlaying: false, currentLap: 1 }),
  setLap: (lap) => set({ currentLap: lap }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setStrategyMode: (strategyMode) => set({ strategyMode }),
  setLiveEnabled: (liveEnabled) => set({ liveEnabled }),
}));
