import { AnimatePresence, motion } from 'framer-motion';
import { useTeams } from '../../hooks/queries';
import { useDrivers } from '../../hooks/queries';
import { useConsoleStore } from '../../store/useConsoleStore';
import { driverFlip, transition } from '../../motion';
import { TyreIcon } from '../ui/TyreIcon';

export function DriverCards() {
  const teamId = useConsoleStore((s) => s.teamId);
  const { data: teams } = useTeams();
  const { data: drivers } = useDrivers(teamId);
  const team = teams?.find((t) => t.id === teamId);

  return (
    <AnimatePresence mode="popLayout">
      {team && drivers && drivers.length > 0 && (
        <motion.div
          key={team.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition.smooth}
          className="mt-8"
          aria-label={`Pembalap ${team.name}`}
        >
          <p className="label-mono mb-3" style={{ color: team.color }}>
            Langkah 1 · Pembalap terpilih — {team.name}
          </p>
          <div className="grid gap-4 sm:grid-cols-2" style={{ perspective: 1200 }}>
            {drivers.map((d, i) => (
              <motion.div
                key={d.id}
                custom={i}
                variants={driverFlip}
                initial="hidden"
                animate="show"
                className="surface-card team-tint relative flex items-center gap-5 overflow-hidden p-5"
                style={{ borderColor: `${team.color}55`, transformStyle: 'preserve-3d' }}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1.5 team-tint"
                  style={{ backgroundColor: team.color }}
                  aria-hidden="true"
                />
                <span
                  className="font-display text-6xl leading-none tracking-tight opacity-90 team-tint"
                  style={{ color: team.color }}
                >
                  {d.number}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-3xl leading-none tracking-wide">{d.code}</span>
                  <span className="mt-1 block text-sm text-muted">{d.name}</span>
                </span>
                <TyreIcon compound="MEDIUM" size={44} label="Ilustrasi ban" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
