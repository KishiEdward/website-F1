import type { TrackStatus } from '../../api/types';
import { TRACK_STATUS_LABEL } from '../../api/mock/db';

const styles: Record<TrackStatus, string> = {
  GREEN: 'border-inter/40 bg-inter/10 text-inter',
  SC: 'border-sc/50 bg-sc/10 text-sc',
  VSC: 'border-sc/50 bg-sc/10 text-sc',
  RED: 'border-red/50 bg-red/10 text-red',
};

const dot: Record<TrackStatus, string> = {
  GREEN: 'bg-inter',
  SC: 'bg-sc',
  VSC: 'bg-sc',
  RED: 'bg-red',
};

export function TrackStatusBadge({ status }: { status: TrackStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${styles[status]}`}
      aria-label={`Status lintasan: ${TRACK_STATUS_LABEL[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]} ${status !== 'GREEN' ? 'pulse-dot' : ''}`} />
      {TRACK_STATUS_LABEL[status]}
    </span>
  );
}
