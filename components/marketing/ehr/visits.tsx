"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const visits = [
  {
    time: "8:40",
    name: "Anas Khan",
    room: "Room 1",
    state: "Completed",
    note: "The visit is finished. The claim is queued.",
  },
  {
    time: "9:00",
    name: "Paul Wallace",
    room: "Room 2",
    state: "In the room",
    note: "New-patient checkup. Labs are ordered. E-prescribe is ready if the visit needs it.",
    live: true,
  },
  {
    time: "10:30",
    name: "Garrett Holliday",
    room: "Room 1",
    state: "To confirm",
    note: "Still on the board. The records release is unsigned.",
  },
];

export function VisitsSection() {
  const [selected, setSelected] = useState(1);

  return (
    <CategorySection
      id="visits"
      flip
      eyebrow="Visits"
      title="Three rooms, one morning."
      body="Anas is finished in room 1. Paul is in room 2 for a new-patient checkup labs ordered, e-prescribe ready if the visit needs it. Garrett is still on the board at 10:30."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Wednesday, October 14</p>
            <p className="text-xs text-graphite">Southeast Medical</p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slash">In the room</p>
        </div>
        <div className="flex flex-col">
          {visits.map((visit, index) => {
            const open = index === selected;
            return (
              <button
                key={visit.time}
                type="button"
                aria-pressed={open}
                onClick={() => setSelected(index)}
                className={cn(
                  "border-t border-line px-5 py-4 text-left first:border-t-0",
                  open ? "bg-mist" : "hover:bg-paper",
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-3xl text-ink">{visit.time}</p>
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-graphite">
                    {visit.live && (
                      <span className="relative flex h-1.5 w-1.5" aria-hidden>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slash opacity-60" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-slash" />
                      </span>
                    )}
                    {visit.state}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  {visit.name}
                  <span className="font-normal text-graphite"> · {visit.room}</span>
                </p>
                {open && <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">{visit.note}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </CategorySection>
  );
}
