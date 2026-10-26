"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const slots = [
  { time: "8:40", name: "Anas Khan", state: "Completed", note: "The visit is finished. The claim is queued." },
  { time: "9:00", name: "Paul Wallace", state: "In room 2", note: "New-patient checkup. Labs are ordered." },
  {
    time: "10:30",
    name: "Garrett Holliday",
    state: "Unconfirmed",
    note: "A follow-up is on the board. Nobody has confirmed it yet.",
  },
];

export function SchedulingSection() {
  const [selected, setSelected] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <CategorySection
      id="scheduling"
      eyebrow="Scheduling"
      title="10:30 is still unconfirmed."
      body="The board already holds the morning. Garrett Holliday has a follow-up at 10:30, and nobody has confirmed it yet."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Wednesday, October 14</p>
            <p className="text-xs text-graphite">Southeast Medical</p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slash">{confirmed ? "Confirmed" : "Unconfirmed"}</p>
        </div>
        <div>
          {slots.map((slot, index) => {
            const open = index === selected;
            const state = slot.time === "10:30" && confirmed ? "Confirmed" : slot.state;
            return (
              <button
                key={slot.time}
                type="button"
                aria-pressed={open}
                onClick={() => setSelected(index)}
                className={cn(
                  "block w-full border-t border-line px-5 py-4 text-left first:border-t-0",
                  open ? "bg-mist" : "hover:bg-paper",
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-3xl text-ink">{slot.time}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-graphite">{state}</p>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{slot.name}</p>
                {open && (
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">
                    {slot.time === "10:30" && confirmed ? "Confirmed for Wednesday morning." : slot.note}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => {
              setSelected(2);
              setConfirmed((value) => !value);
            }}
            className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            {confirmed ? "Undo the confirmation" : "Confirm 10:30"}
          </button>
        </div>
      </div>
    </CategorySection>
  );
}
