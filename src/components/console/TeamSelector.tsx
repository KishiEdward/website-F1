import { motion } from 'framer-motion';
import { useTeams, useDrivers } from '../../hooks/queries';
import { useConsoleStore } from '../../store/useConsoleStore';
import { SectionTitle } from '../ui/SectionTitle';
import { Skeleton } from '../ui/Skeleton';
import { container, scaleIn, transition } from '../../motion';

export function TeamSelector() {
  const { data: teams, isLoading } = useTeams();
  const teamId = useConsoleStore((s) => s.teamId);
  const setTeam = useConsoleStore((s) => s.setTeam);
  const { data: drivers, isFetching: driversLoading } = useDrivers(teamId);

  const onSelect = (id: string) => {
    if (id === teamId) return;
    // driver menyusul via query; set awal kosong lalu diperbarui saat data tiba
    setTeam(id, []);
  };

  // sinkronkan driver ke store saat query selesai
  if (drivers && teamId) {
    const storeIds = useConsoleStore.getState().driverIds;
    const ids = drivers.map((d) => d.id);
    if (storeIds.length !== ids.length || storeIds.some((s) => !ids.includes(s))) {
      useConsoleStore.setState({ driverIds: ids });
    }
  }

  return (
    <section aria-label="Pilih tim">
      <SectionTitle
        kicker="Langkah 1"
        title="PILIH TIM"
        description="Dua pembalap dari tim terpilih otomatis mengikuti. Warna aksen antarmuka menyesuaikan warna tim."
      />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container(0.05)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          role="radiogroup"
          aria-label="Daftar tim"
        >
          {teams?.map((team) => {
            const active = team.id === teamId;
            return (
              <motion.button
                key={team.id}
                variants={scaleIn}
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(team.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={transition.snappy}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-500 ${
                  active
                    ? 'border-transparent bg-surface2'
                    : 'border-line bg-surface hover:border-muted/40'
                }`}
                style={active ? { boxShadow: `0 0 0 2px ${team.color}, 0 8px 30px ${team.color}33` } : undefined}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 transition-colors duration-500"
                  style={{ backgroundColor: team.color }}
                  aria-hidden="true"
                />
                <span className="label-mono block" style={{ color: active ? team.color : undefined }}>
                  {team.shortName}
                </span>
                <span className="mt-1 block text-sm font-bold leading-tight text-ink">{team.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      )}
      {driversLoading && teamId && <p className="label-mono mt-4">Memuat pembalap…</p>}
    </section>
  );
}
