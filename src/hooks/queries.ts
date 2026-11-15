import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { PredictionInput } from '../api/types';

export const useTeams = () =>
  useQuery({ queryKey: ['teams'], queryFn: () => api.getTeams(), staleTime: Infinity });

export const useDrivers = (teamId: string | null) =>
  useQuery({
    queryKey: ['drivers', teamId],
    queryFn: () => api.getDrivers(teamId as string),
    enabled: !!teamId,
    staleTime: Infinity,
  });

export const useSeasons = () =>
  useQuery({ queryKey: ['seasons'], queryFn: () => api.getSeasons(), staleTime: Infinity });

export const useRaces = (season: number) =>
  useQuery({ queryKey: ['races', season], queryFn: () => api.getRaces(season), staleTime: Infinity });

export const useRaceLaps = (raceId: string | null, live = false) =>
  useQuery({
    queryKey: ['raceLaps', raceId],
    queryFn: () => api.getRaceLaps(raceId as string),
    enabled: !!raceId,
    staleTime: Infinity,
    refetchInterval: live ? 4000 : false,
  });

export const useStrategy = (raceId: string | null, driverId: string | null) =>
  useQuery({
    queryKey: ['strategy', raceId, driverId],
    queryFn: () => api.getStrategy(raceId as string, driverId as string),
    enabled: !!raceId && !!driverId,
    staleTime: Infinity,
  });

export const usePrediction = (input: PredictionInput | null) =>
  useQuery({
    queryKey: ['prediction', input?.raceId, input?.driverId, input?.lap],
    queryFn: () => api.predict(input as PredictionInput),
    enabled: !!input,
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  });
