import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 500);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <motion.circle
                cx="40" cy="40" r="36"
                stroke="#c8a45c"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              <motion.path
                d="M25 55 C25 35, 35 25, 40 20 C45 25, 55 35, 55 55"
                stroke="#c8a45c"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              />
              <motion.path
                d="M30 50 L30 35 M40 45 L40 28 M50 50 L50 35"
                stroke="#c62828"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-arabic text-2xl font-bold text-[#c8a45c] mb-2"
          >
            مشاوي صح
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-display text-xs text-[#666] tracking-[3px] uppercase mb-8"
          >
            Mashawy Sah
          </motion.p>

          {/* Progress Bar */}
          <div className="w-48 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c8a45c]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
