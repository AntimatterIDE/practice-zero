"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const notes = [
  {
    label: "Mornings",
    title: "Mornings",
    body: "Wednesday visits, from 8:40.",
    action: "Post",
    undo: "Take it down",
    live: "On the practice page.",
    idle: "Still a draft.",
  },
  {
    label: "New patients",
    title: "New patients",
    body: "Blood pressure visits, mornings.",
    action: "Post",
    undo: "Take it down",
    live: "On the practice page.",
    idle: "Still a draft.",
  },
  {
    label: "Review",
    title: "Paul Wallace",
    body: "The 9:00 visit started on time.",
    action: "Show the review",
    undo: "Hide the review",
    live: "On the practice page. Counts stay off.",
    idle: "Held back from the page.",
  },
];

export function SocialSection() {
  const [selected, setSelected] = useState(0);
  const [live, setLive] = useState<boolean[]>(() => notes.map(() => false));
  const note = notes[selected];
  const posted = live[selected];

  return (
    <CategorySection
      id="social"
      eyebrow="Social"
      title="The practice, in public."
      body="Two notes the practice can post: mornings are open, and new patients are welcome. Reputation and reviews stay part of how the practice shows up counts stay off the page."
    >
      <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4">
          {notes.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                index === selected ? "bg-ink text-paper" : "bg-mist text-graphite hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className={cn("px-5 py-6", posted && selected !== 2 && "bg-ink text-paper")}>
          <p className={cn("text-[11px] uppercase tracking-[0.16em]", posted && selected !== 2 ? "text-white/50" : "text-graphite/70")}>
            {posted ? "Public" : "Draft"}
          </p>
          <p className="mt-3 font-display text-3xl">{note.title}</p>
          <p className={cn("mt-3 max-w-sm text-sm leading-relaxed", posted && selected !== 2 ? "text-paper/70" : "text-graphite")}>
            {note.body}
          </p>
        </div>
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => setLive((current) => current.map((item, index) => (index === selected ? !item : item)))}
            className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            {posted ? note.undo : note.action}
          </button>
          <p className="mt-3 text-xs text-graphite" aria-live="polite">
            {posted ? note.live : note.idle}
          </p>
        </div>
      </article>
    </CategorySection>
  );
}
