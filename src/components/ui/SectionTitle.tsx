import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../motion';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionTitle({ kicker, title, description, children, className = '' }: Props) {
  return (
    <motion.div
      variants={container()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`mb-8 ${className}`}
    >
      {kicker && (
        <motion.p variants={fadeUp} className="label-mono mb-2 text-accent">
          {kicker}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-display text-4xl leading-none tracking-wide sm:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </motion.p>
      )}
      {children}
    </motion.div>
  );
}
