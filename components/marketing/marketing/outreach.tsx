"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function OutreachSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Outreach"
      title="The text is written. It has not been sent."
      body="Elena Voss has a balance from the June visit. The message is sitting in the outbox, in this browser, waiting."
    >
      <TiltFrame className="relative mx-auto h-80 w-full max-w-sm">
        <Drift dx={10} dy={8} className="absolute inset-x-8 top-0">
          <div className="mx-auto h-[19rem] rounded-[2.2rem] border border-line bg-ink p-3 shadow-2xl">
            <div className="flex h-full flex-col rounded-[1.6rem] bg-ink p-4">
              <p className="text-center text-[11px] text-graphite">Outbox · text</p>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-auto rounded-2xl rounded-bl-md bg-white px-3 py-3 text-sm leading-relaxed text-ink"
              >
                Elena, a balance from the June visit is waiting. Reply if you want a statement.
              </motion.div>
              <p className="mt-3 text-center text-[11px] text-graphite">Nothing has been sent</p>
            </div>
          </div>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
