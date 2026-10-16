"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

const slots = [
  { time: "8:40", name: "Elena Voss", state: "Completed" },
  { time: "9:00", name: "Paul Wallace", state: "In room 2" },
  { time: "10:30", name: "Chris Adelman", state: "Unconfirmed" },
];

export function SchedulingSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Scheduling"
      title="10:30 is still unconfirmed."
      body="The board already holds the morning. Chris Adelman has a follow-up at 10:30, and nobody has confirmed it yet."
    >
      <TiltFrame className="relative pl-8">
        <div className="absolute bottom-2 left-3 top-2 w-px bg-neutral-200" />
        <div className="grid gap-4">
          {slots.map((slot, index) => (
            <Drift key={slot.time} dx={6 + index * 4} dy={4}>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`relative rounded-2xl border px-4 py-3 ${
                  slot.state === "Unconfirmed" ? "border-neutral-950 bg-ink text-white" : "border-line bg-white"
                }`}
              >
                <span className="absolute -left-[1.85rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ink" />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-2xl">{slot.time}</p>
                  <p className={`text-xs ${slot.state === "Unconfirmed" ? "text-paper/55" : "text-graphite"}`}>{slot.state}</p>
                </div>
                <p className="text-sm">{slot.name}</p>
              </motion.div>
            </Drift>
          ))}
        </div>
      </TiltFrame>
    </CategorySection>
  );
}
