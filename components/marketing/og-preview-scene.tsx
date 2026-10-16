"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * 1200×630 OG / iMessage card — one mark, one wordmark, one motion.
 */
export function OgPreviewScene() {
  return (
    <div
      data-og-scene
      className="relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-[#0B0D10] text-[#F5F4EF]"
      style={{ fontFamily: "var(--font-sans-family), system-ui, sans-serif" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(45,75,240,0.22),transparent_55%)]"
      />

      <div className="relative flex flex-col items-center text-center">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 80"
          fill="none"
          width={220}
          height={275}
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <ellipse
            cx="32"
            cy="40"
            rx="22"
            ry="30"
            stroke="#F5F4EF"
            strokeWidth="7"
            fill="none"
          />
          <motion.path
            d="M14 62 L50 18"
            stroke="#2D4BF0"
            strokeWidth="7"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.05, delay: 0.25, ease }}
          />
        </motion.svg>

        <motion.p
          className="mt-8 text-[56px] font-semibold lowercase leading-none tracking-[-0.055em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
        >
          practice zero
        </motion.p>
      </div>
    </div>
  );
}
