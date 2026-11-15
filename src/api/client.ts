import type { ApiClient } from './types';
import { mockClient } from './mockClient';
import { httpClient } from './httpClient';

/**
 * Satu-satunya titik pergantian mock ↔ API asli.
 * VITE_USE_MOCK=false → httpClient (API Python), selain itu → mockClient.
 */
export const api: ApiClient =
  import.meta.env.VITE_USE_MOCK === 'false' ? httpClient : mockClient;

export const IS_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const LIVE_ENABLED = import.meta.env.VITE_ENABLE_LIVE === 'true';

export type { ApiClient } from './types';
export * from './types';
