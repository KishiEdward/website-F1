import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion';

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = true, className = '', children, ...rest }: Props) {
  const Comp = motion.div as typeof motion.div;
  return (
    <Comp
      variants={fadeUp}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`surface-card shadow-card ${className}`}
      {...(rest as object)}
    >
      {children}
    </Comp>
  );
}
