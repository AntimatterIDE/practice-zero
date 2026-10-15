"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

const rooms = [
  { time: "8:40", name: "Elena Voss", detail: "Room 1 · completed", dx: 16, dy: 8, className: "top-2 left-0 w-[88%]" },
  { time: "9:00", name: "Jordan Hale", detail: "Room 2 · in the room", dx: 8, dy: 14, className: "top-28 left-[6%] w-[88%]" },
  { time: "10:30", name: "Chris Adelman", detail: "Room 1 · still to confirm", dx: 18, dy: 6, className: "top-52 right-0 w-[88%]" },
];

export function VisitsSection() {
  return (
    <CategorySection
      flip
      eyebrow="Visits"
      title="Three rooms, one morning."
      body="Elena is finished in room 1. Jordan is in room 2 for a new-patient checkup. Chris is still on the board at 10:30."
    >
      <TiltFrame className="relative h-[26rem]">
        {rooms.map((room) => (
          <Drift key={room.time} dx={room.dx} dy={room.dy} className={`absolute ${room.className}`}>
            <article className="rounded-3xl border border-neutral-200 bg-white px-5 py-4 shadow-xl shadow-neutral-900/10">
              <p className="font-display text-3xl text-neutral-950">{room.time}</p>
              <p className="mt-2 text-sm font-medium text-neutral-950">{room.name}</p>
              <p className="text-xs text-neutral-500">{room.detail}</p>
            </article>
          </Drift>
        ))}
      </TiltFrame>
    </CategorySection>
  );
}
