"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Fixed 1200×630 OG / iMessage preview — large brand mark, almost no copy.
 * Designed to read at thumbnail size: motion over micro-UI.
 */
export function OgPreviewScene() {
  return (
    <div
      data-og-scene
      className="relative h-[630px] w-[1200px] overflow-hidden bg-[#0c0e11] text-[#F5F4EF]"
      style={{ fontFamily: "var(--font-sans-family), system-ui, sans-serif" }}
    >
      {/* Slow breathing glow behind the mark */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2D4BF0]/35 blur-[120px]"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[58%] top-[38%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2D4BF0]/20 blur-[90px]"
        animate={{ opacity: [0.2, 0.55, 0.2], x: [0, 24, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Giant soft Ø field */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] select-none font-mono text-[640px] leading-none text-white/[0.035]"
        animate={{ rotate: [0, 4, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        Ø
      </motion.span>

      <div className="relative flex h-full flex-col items-center justify-center px-16">
        {/* Hero mark */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 80"
            fill="none"
            width={220}
            height={275}
            aria-hidden
            className="drop-shadow-[0_24px_60px_rgba(45,75,240,0.35)]"
          >
            {/* Oval draws on */}
            <motion.ellipse
              cx="32"
              cy="40"
              rx="22"
              ry="30"
              stroke="#F5F4EF"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease }}
            />
            {/* Slash strikes through — loops for drama */}
            <motion.path
              d="M14 62 L50 18"
              stroke="#2D4BF0"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0.15, 1],
                opacity: [0, 1, 1, 1, 1],
              }}
              transition={{
                duration: 4,
                times: [0, 0.28, 0.55, 0.72, 1],
                repeat: Infinity,
                ease,
              }}
            />
          </svg>

          {/* Soft pulse ring */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2D4BF0]/40"
            animate={{ scale: [0.75, 1.25], opacity: [0.55, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F4EF]/15"
            animate={{ scale: [0.7, 1.35], opacity: [0.35, 0] }}
            transition={{ duration: 2.8, delay: 0.9, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>

        {/* Wordmark — large, sparse */}
        <motion.p
          className="mt-2 text-[42px] font-semibold lowercase tracking-[-0.045em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
        >
          practice zero
        </motion.p>

        {/* One short line only */}
        <motion.p
          className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[#F5F4EF]/55"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0.7, 1] }}
          transition={{ duration: 4, delay: 0.9, times: [0, 0.2, 0.5, 0.75, 1], repeat: Infinity, ease }}
        >
          less administration. more care.
        </motion.p>
      </div>
    </div>
  );
}
