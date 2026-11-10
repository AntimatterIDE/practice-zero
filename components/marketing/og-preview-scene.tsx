"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const PAPER = "#F5F4EF";
const INK = "#111418";
const SLASH = "#2D4BF0";

/**
 * 1200×630 OG / iMessage card.
 * Paper field, the pill mark, and the wordmark.
 */
export function OgPreviewScene() {
  return (
    <div
      data-og-scene
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center overflow-hidden"
      style={{
        background: PAPER,
        color: INK,
        fontFamily: "var(--font-sans-family), system-ui, sans-serif",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #FAF9F5 0%, #F5F4EF 100%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
          width={168}
          height={168}
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <rect x="23" y="9" width="54" height="82" rx="27" stroke={INK} strokeWidth="12" fill="none" />
          <motion.line
            x1="42"
            y1="60"
            x2="58"
            y2="40"
            stroke={SLASH}
            strokeWidth="12"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.15, ease }}
          />
        </motion.svg>

        <motion.p
          className="mt-8 font-semibold lowercase leading-none tracking-[-0.045em]"
          style={{ fontSize: 92 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease }}
        >
          practice zero
        </motion.p>
      </div>
    </div>
  );
}
