"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const WtfAnimatedBadge: React.FC = () => {
  const [cycleKey, setCycleKey] = useState(0);

  const handleTrigger = () => {
    setCycleKey((prev) => prev + 1);
  };

  // Visibly paced so the user can clearly track the carousel shuffle
  const duration = 0.95;
  const ease = "easeInOut";

  return (
    <div
      onMouseEnter={handleTrigger}
      className="relative h-7 px-2.5 bg-zinc-950 text-white rounded-[6px] flex items-center justify-center font-mono font-black text-[13px] tracking-wider shadow-2xs cursor-pointer select-none overflow-visible group-hover:scale-105 transition-transform"
      title="Hover to shuffle letters"
    >
      <div className="relative flex items-center justify-center h-full">
        {/* Letter W: Dips back, slides behind T, moves forward to F spot, returns */}
        <motion.span
          key={`w-${cycleKey}`}
          className="inline-block relative text-center text-white"
          style={{ width: "11px" }}
          animate={
            cycleKey > 0
              ? {
                  x: [0, 11, 22, 0],
                  y: [0, -3.5, 0, 0],
                  scale: [1, 0.75, 0.9, 1],
                  opacity: [1, 0.6, 0.9, 1],
                  zIndex: [2, 0, 2, 2],
                }
              : {}
          }
          transition={{ duration, ease }}
        >
          W
        </motion.span>

        {/* Letter T: Dips back, slides behind F, moves forward to W spot, returns */}
        <motion.span
          key={`t-${cycleKey}`}
          className="inline-block relative text-center text-white"
          style={{ width: "11px" }}
          animate={
            cycleKey > 0
              ? {
                  x: [0, 11, -11, 0],
                  y: [0, -3.5, 0, 0],
                  scale: [1, 0.75, 0.9, 1],
                  opacity: [1, 0.6, 0.9, 1],
                  zIndex: [2, 0, 2, 2],
                }
              : {}
          }
          transition={{ duration, ease }}
        >
          T
        </motion.span>

        {/* Letter F: Dips back, sweeps all the way behind W, moves forward to T spot, returns */}
        <motion.span
          key={`f-${cycleKey}`}
          className="inline-block relative text-center text-white"
          style={{ width: "11px" }}
          animate={
            cycleKey > 0
              ? {
                  x: [0, -22, -11, 0],
                  y: [0, -3.5, 0, 0],
                  scale: [1, 0.75, 0.9, 1],
                  opacity: [1, 0.6, 0.9, 1],
                  zIndex: [2, 0, 2, 2],
                }
              : {}
          }
          transition={{ duration, ease }}
        >
          F
        </motion.span>
      </div>
    </div>
  );
};
