import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageTransitionReduced } from '../../motion';

export function PageTransition({
  children,
  reduced,
}: {
  children: ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div
      variants={reduced ? pageTransitionReduced : pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
