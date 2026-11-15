import { AnimatePresence, motion } from 'framer-motion';
import type { Compound } from '../../api/types';
import { COMPOUND_COLORS, COMPOUND_LETTER } from '../../api/mock/db';
import { transition } from '../../motion';

interface Props {
  compound: Compound;
  size?: number;
  label?: string;
}

/** Ikon ban (ilustrasi sendiri) — morph antar compound saat nilai berubah. */
export function TyreIcon({ compound, size = 64, label }: Props) {
  const color = COMPOUND_COLORS[compound];
  const r = size / 2;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Compound ${compound}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.svg
          key={compound}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.25, rotate: 60 }}
          transition={transition.spring}
          className="absolute inset-0"
        >
          {/* badan ban */}
          <circle cx={r} cy={r} r={r - 1} fill="#141416" stroke="#2c2c34" strokeWidth={1.5} />
          {/* tread blocks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = r + Math.cos(a) * (r - 4);
            const y1 = r + Math.sin(a) * (r - 4);
            const x2 = r + Math.cos(a) * (r - 8);
            const y2 = r + Math.sin(a) * (r - 8);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#232329"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
          {/* ring warna compound */}
          <circle cx={r} cy={r} r={r * 0.62} fill="none" stroke={color} strokeWidth={size * 0.075} />
          <text
            x={r}
            y={r + size * 0.11}
            textAnchor="middle"
            fontSize={size * 0.3}
            fontWeight={700}
            fontFamily="'JetBrains Mono', monospace"
            fill="#f4f4f6"
          >
            {COMPOUND_LETTER[compound]}
          </text>
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}
