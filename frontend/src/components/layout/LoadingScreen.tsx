import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const springTransition = {
  type: 'spring',
  stiffness: 120,
  damping: 18,
  mass: 0.8
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070709] overflow-hidden"
        >
          {/* Carbon Fiber Background */}
          <div className="absolute inset-0 carbon-pattern opacity-40" />
          
          {/* Converging Track Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.15 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="absolute w-full h-[1px] bg-[#E10600] origin-center"
            />
            <motion.div 
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.15 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="absolute h-full w-[1px] bg-[#00F0FF] origin-center"
            />
            {/* Diagonal timing grid lines */}
            <motion.div 
              initial={{ rotate: 45, scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.05 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="absolute w-full h-[2px] bg-white origin-center"
            />
            <motion.div 
              initial={{ rotate: -45, scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.05 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="absolute w-full h-[2px] bg-white origin-center"
            />
          </div>

          {/* Rev Counter / Speedometer Loader */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="180 180" strokeLinecap="round" fill="none" className="rotate-[135deg] origin-center" />
                
                {/* Active Rev Light Bar */}
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#E10600" 
                  strokeWidth="5" 
                  strokeDasharray="180 180" 
                  initial={{ strokeDashoffset: 180 }}
                  animate={{ strokeDashoffset: [180, 0, 45, 0, 90] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2.2, 
                    ease: "easeInOut" 
                  }}
                  strokeLinecap="round" 
                  fill="none" 
                  className="rotate-[135deg] origin-center" 
                />
              </svg>
              
              {/* Central Rev Counter Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                <motion.span 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-3xl font-black font-display tracking-wider text-white"
                >
                  RPM
                </motion.span>
                <span className="text-[10px] font-mono text-[#00F0FF]">CHRONO</span>
              </div>
            </div>

            {/* Checkered flag wipe element */}
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    ...springTransition,
                    delay: i * 0.08
                  }}
                  className={`w-3.5 h-3.5 rounded-sm ${
                    i % 2 === 0 ? 'bg-white' : 'bg-[#E10600]'
                  }`}
                />
              ))}
            </div>
            
            {/* Loading text with negative letter spacing */}
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={springTransition}
              className="text-lg font-bold tracking-widest text-gray-400 font-display"
            >
              SYNCHRONIZING TELEMETRY...
            </motion.h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
