"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const PAPER = "#F5F4EF";
const INK = "#111418";
const SLASH = "#2D4BF0";

/**
 * 1200×630 OG / iMessage card.
 * Paper field, centered mark over the letters PZ — nothing else.
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
          viewBox="0 0 64 80"
          fill="none"
          width={128}
          height={160}
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <ellipse
            cx="32"
            cy="40"
            rx="22"
            ry="30"
            stroke={INK}
            strokeWidth="8"
            fill="none"
          />
          <motion.path
            d="M14 62 L50 18"
            stroke={SLASH}
            strokeWidth="8"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease }}
          />
        </motion.svg>

        <motion.p
          className="mt-8 font-semibold leading-none tracking-[-0.06em]"
          style={{ fontSize: 200 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease }}
        >
          PZ
        </motion.p>
      </div>
    </div>
  );
}
