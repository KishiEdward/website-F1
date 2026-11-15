import type { ApiClient } from './types';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const httpClient: ApiClient = {
  getTeams: () => get('/teams'),
  getDrivers: (teamId) => get(`/teams/${teamId}/drivers`),
  getSeasons: () => get('/seasons'),
  getRaces: (season) => get(`/races?season=${season}`),
  getRaceLaps: (raceId) => get(`/race/${raceId}/laps`),
  getStrategy: (raceId, driverId) => get(`/race/${raceId}/strategy?driver=${driverId}`),
  predict: (input) => post('/predict', input),
};
