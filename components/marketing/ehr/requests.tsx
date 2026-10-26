"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";

export function RequestsSection() {
  const [held, setHeld] = useState(false);

  return (
    <CategorySection
      id="requests"
      eyebrow="Requests"
      title="A morning, asked for."
      body="Morgan Lee wrote in at 7:40. A new-patient visit for blood pressure. Mornings work best. The request is still new."
    >
      <article className="rounded-3xl border border-line bg-white p-6 shadow-2xl shadow-ink/10">
        <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">{held ? "Held · Thursday 9:00" : "New · 7:40"}</p>
        <h3 className="mt-2 font-display text-3xl text-ink">Morgan Lee</h3>
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          {held
            ? "A morning is held. Thursday at 9:00, new-patient visit for blood pressure."
            : "I would like a new-patient visit for blood pressure. Mornings work best."}
        </p>
        <button
          type="button"
          onClick={() => setHeld((value) => !value)}
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          {held ? "Release the hold" : "Hold Thursday at 9:00"}
        </button>
      </article>
    </CategorySection>
  );
}
