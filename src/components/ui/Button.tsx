import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { transition } from '../../motion';

type Variant = 'primary' | 'ghost' | 'outline';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-semibold tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40';

const styles: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-[#ff1a10]',
  ghost: 'bg-transparent text-muted hover:text-ink',
  outline: 'border border-line bg-surface text-ink hover:border-accent/60 hover:text-accent',
};

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={transition.snappy}
      className={`${base} ${styles[variant]} ${className}`}
      {...(rest as object)}
    >
      {/* sapuan cahaya saat hover — hanya transform */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full hover:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
