"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Eligibility checked",
    detail: "Paul Wallace is active out of network. The $185 fee is due today.",
    waiting: false,
  },
  {
    title: "Note drafted",
    detail: "The 9:00 visit has a transcript, a note, and e-prescribe.",
    waiting: false,
  },
  {
    title: "Confirm 10:30",
    detail: "Garrett Holliday is still unconfirmed. The records release is unsigned.",
    done: "Confirmed. The morning can keep that slot.",
    waiting: true,
  },
  {
    title: "Patient pay text",
    detail: "Anas Khan’s $40 balance text is waiting in the outbox.",
    done: "Approved to send.",
    waiting: true,
  },
];

export function AiBoardSection() {
  const [approved, setApproved] = useState<boolean[]>(() => items.map((item) => !item.waiting));
  const waiting = approved.filter((item) => !item).length;

  return (
    <CategorySection
      id="board"
      eyebrow="Agents"
      title="Agents clear the morning. You keep the exceptions."
      body="Eligibility and the note are already done. Two things are still waiting on a person: Garrett’s 10:30, and Anas’s balance text."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Wednesday, October 14</p>
          <p className="text-xs text-graphite" aria-live="polite">
            {waiting === 0 ? "Clear for now" : `${waiting} waiting on you`}
          </p>
        </div>
        <div>
          {items.map((item, index) => {
            const done = approved[index];
            return (
              <button
                key={item.title}
                type="button"
                aria-pressed={done}
                disabled={!item.waiting}
                onClick={() =>
                  setApproved((current) => current.map((value, valueIndex) => (valueIndex === index ? !value : value)))
                }
                className={cn(
                  "flex w-full items-start gap-4 border-t border-line px-5 py-4 text-left first:border-t-0 disabled:opacity-100",
                  item.waiting ? "hover:bg-paper" : "cursor-default",
                  done && item.waiting && "bg-mist",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    done ? "border-ink bg-ink text-paper" : "border-line bg-white text-transparent",
                  )}
                  aria-hidden
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  <span className="block font-display text-2xl text-ink">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">
                    {done && item.done ? item.done : item.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </CategorySection>
  );
}
