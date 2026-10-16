"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const rows = [
  { label: "Scribe", detail: "Listening · transcript ready", delay: 0.35 },
  { label: "Codes", detail: "I10 · Z00.00 · 99203", delay: 0.7 },
  { label: "Claim", detail: "Draft · $185 · queued", delay: 1.05 },
];

const claims = [
  { status: "Paid", amount: "$185", tone: "ok" as const },
  { status: "Draft", amount: "$240", tone: "mid" as const },
  { status: "Review", amount: "$92", tone: "warn" as const },
];

/**
 * Fixed 1200×630 dark-mode composition for iMessage og:video capture.
 * Animations loop so a 3–5s recording reads as continuous.
 */
export function OgPreviewScene() {
  return (
    <div
      data-og-scene
      className="relative h-[630px] w-[1200px] overflow-hidden bg-[#111418] text-[#F5F4EF]"
      style={{ fontFamily: "var(--font-sans-family), system-ui, sans-serif" }}
    >
      {/* Soft accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#2D4BF0]/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[380px] w-[480px] rounded-full bg-[#2D4BF0]/15 blur-[110px]"
      />

      {/* Ø watermark */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-mono text-[420px] leading-none text-white/[0.04]"
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        Ø
      </motion.span>

      <div className="relative flex h-full gap-10 px-14 py-12">
        {/* Brand + copy */}
        <div className="flex w-[420px] shrink-0 flex-col justify-between">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 80"
              fill="none"
              width={28}
              height={35}
              aria-hidden
            >
              <ellipse cx="32" cy="40" rx="22" ry="30" stroke="#F5F4EF" strokeWidth="7" />
              <path d="M14 62 L50 18" stroke="#2D4BF0" strokeWidth="7" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-semibold lowercase tracking-[-0.03em]">practice zero</span>
          </div>

          <div>
            <motion.h1
              className="max-w-[14ch] text-[52px] font-semibold leading-[1.02] tracking-[-0.04em]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              less administration. more care.
            </motion.h1>
            <motion.p
              className="mt-5 max-w-[28ch] text-[17px] leading-relaxed text-[#F5F4EF]/65"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
            >
              Live scribe, codes, and claims on one morning board.
            </motion.p>
          </div>

          <motion.div
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#F5F4EF]/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="inline-block size-1.5 rounded-full bg-[#2D4BF0]" />
            agentic ehr
          </motion.div>
        </div>

        {/* Product UI cards */}
        <div className="relative flex flex-1 items-center justify-end">
          <motion.div
            className="relative w-[520px] rounded-[1.5rem] border border-white/10 bg-[#1a1d22] p-5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div>
                <p className="text-sm font-semibold">Jordan Hale</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F5F4EF]/45">
                  9:00 · room 2 · in progress
                </p>
              </div>
              <motion.span
                className="rounded-full bg-[#2D4BF0]/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#a8b5f8]"
                animate={{ opacity: [1, 0.55, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Live
              </motion.span>
            </div>

            <div className="mt-3.5 grid gap-2.5">
              {rows.map((row) => (
                <motion.div
                  key={row.label}
                  className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: row.delay, ease }}
                >
                  <span className="text-sm font-medium">{row.label}</span>
                  <span className="text-sm text-[#F5F4EF]/55">{row.detail}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating claim chips */}
          <div className="pointer-events-none absolute -right-2 top-6 flex flex-col gap-2.5">
            {claims.map((claim, i) => (
              <motion.div
                key={claim.status}
                className="rounded-2xl border border-white/10 bg-[#15181d]/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: 28 }}
                animate={{
                  opacity: 1,
                  x: [0, i % 2 === 0 ? -6 : 4, 0],
                  y: [0, i === 1 ? -4 : 3, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.2 + i * 0.15 },
                  x: { duration: 3.6, delay: 1.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4.2, delay: 1.5 + i * 0.15, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5F4EF]/45">
                  Claim
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{claim.amount}</span>
                  <span
                    className={
                      claim.tone === "ok"
                        ? "text-[11px] text-[#8fd4a8]"
                        : claim.tone === "warn"
                          ? "text-[11px] text-[#f0c36a]"
                          : "text-[11px] text-[#a8b5f8]"
                    }
                  >
                    {claim.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scribe note settle */}
          <motion.div
            className="absolute -bottom-1 left-8 max-w-[280px] rounded-2xl border border-white/10 bg-[#0c0e11] p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0.85, 1], y: [20, 0, 0, 0, 0] }}
            transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, ease }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5F4EF]/4">Note</p>
            <p className="mt-2 text-[15px] leading-snug tracking-[-0.02em]">
              Essential hypertension. Continue lisinopril. Return in a month.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
