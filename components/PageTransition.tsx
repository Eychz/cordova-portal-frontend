'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;