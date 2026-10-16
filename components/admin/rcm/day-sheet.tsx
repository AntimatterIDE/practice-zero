import type { ReactNode } from "react";
import Link from "next/link";
import { visitTypeLabel } from "@/lib/rcm/chart";
import { formatTime } from "@/lib/rcm/format";
import type { Appointment } from "@/lib/rcm/types";
import { visitLabel } from "@/components/admin/rcm/ui";
import { cn } from "@/lib/utils";

const practiceRooms = ["Room 1", "Room 2", "Procedure"];

/** Rem per hour column — wide enough that short visits stay readable. */
const HOUR_REM = 12;
const ROOM_LABEL_REM = 8.75;
/** Floor so name + time + Record never collapse into a strip. */
const MIN_CARD_REM = 12;
const GUTTER_REM = 0.35;

function clock(start: string) {
  const match = /T(\d{2}):(\d{2})/.exec(start);
  if (!match) return { hour: 9, minute: 0 };
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

function minutes(start: string) {
  const parts = clock(start);
  return parts.hour * 60 + parts.minute;
}

function hourLabel(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const hour12 = hour % 12 || 12;
  return `${hour12} ${hour < 12 ? "AM" : "PM"}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

export function DaySheet({
  visits,
  names,
  empty,
  title = "Rooms",
  renderExtra,
  recordHref,
}: {
  visits: Appointment[];
  names: Map<string, string>;
  empty: string;
  title?: string;
  renderExtra?: (visit: Appointment) => ReactNode;
  recordHref?: (visit: Appointment, name: string) => string;
}) {
  const seenRooms = [...new Set(visits.map((visit) => visit.room || "Room 1"))];
  const rooms = [...practiceRooms];
  for (const room of seenRooms) {
    if (!rooms.includes(room)) rooms.push(room);
  }

  const starts = visits.map((visit) => minutes(visit.start));
  const finishes = visits.map((visit) => minutes(visit.start) + (visit.durationMinutes || 30));
  const earliest = starts.length ? Math.min(...starts) : 8 * 60;
  const latest = finishes.length ? Math.max(...finishes) : 12 * 60;
  const windowStart = starts.length ? Math.floor(Math.min(8 * 60, earliest - 60) / 60) * 60 : 8 * 60;
  const windowEnd = starts.length ? Math.max(windowStart + 4 * 60, Math.ceil(latest / 60) * 60 + 60) : 12 * 60;
  const span = windowEnd - windowStart;
  const hours = Array.from({ length: span / 60 }, (_, index) => windowStart + index * 60);
  const laneHeight = renderExtra ? (recordHref ? 12.75 : 11.5) : recordHref ? 7.5 : 6.1;

  // Minutes a min-width card covers on the time axis (for overlap lanes).
  const minVisualMinutes = Math.ceil((MIN_CARD_REM / HOUR_REM) * 60);

  const byRoom = new Map<string, { visit: Appointment; lane: number }[]>();
  for (const room of rooms) {
    const laneEnds: number[] = [];
    const placed = visits
      .filter((visit) => (visit.room || "Room 1") === room)
      .sort((a, b) => a.start.localeCompare(b.start))
      .map((visit) => {
        const start = minutes(visit.start);
        const duration = visit.durationMinutes || 30;
        const visualEnd = start + Math.max(duration, minVisualMinutes);
        let lane = laneEnds.findIndex((endAt) => endAt <= start);
        if (lane < 0) {
          lane = laneEnds.length;
          laneEnds.push(visualEnd);
        } else {
          laneEnds[lane] = visualEnd;
        }
        return { visit, lane };
      });
    byRoom.set(room, placed);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_16px_36px_-28px_rgb(7_30_54_/_0.45)]">
      <div className="flex items-end justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-oxide">Day sheet</p>
          <h2 className="mt-1 font-display text-2xl tracking-tight">{title}</h2>
        </div>
        <p className="text-sm text-muted">{visits.length === 0 ? empty : `${visits.length} on the board`}</p>
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${ROOM_LABEL_REM + hours.length * HOUR_REM}rem` }}>
          <div
            className="grid"
            style={{ gridTemplateColumns: `${ROOM_LABEL_REM}rem repeat(${hours.length}, minmax(${HOUR_REM}rem, 1fr))` }}
          >
            <div className="bg-mist/40" />
            {hours.map((hour) => (
              <div key={hour} className="border-l border-line bg-mist/40 px-3 py-2.5 text-[0.7rem] font-semibold text-muted">
                {hourLabel(hour)}
              </div>
            ))}
          </div>
          {rooms.map((room) => {
            const placed = byRoom.get(room) ?? [];
            const lanes = Math.max(1, ...placed.map((item) => item.lane + 1), 1);
            return (
              <div
                key={room}
                className="grid border-t border-line"
                style={{ gridTemplateColumns: `${ROOM_LABEL_REM}rem minmax(0, 1fr)` }}
              >
                <div className="bg-card px-3 py-3">
                  <p className="font-display text-xl leading-none">{room}</p>
                  <p className="mt-1 text-xs text-muted">
                    {placed.length === 0 ? "Open" : `${placed.length} ${placed.length === 1 ? "visit" : "visits"}`}
                  </p>
                </div>
                <div
                  className="relative border-l border-line"
                  style={{ minHeight: `${placed.length === 0 ? 4.75 : lanes * laneHeight + 0.9}rem` }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}
                  >
                    {hours.map((hour) => (
                      <div key={hour} className="border-l border-line/70 first:border-l-0" />
                    ))}
                  </div>
                  {placed.map(({ visit, lane }) => {
                    const name = names.get(visit.patientId) ?? "Unknown patient";
                    const start = minutes(visit.start);
                    const duration = visit.durationMinutes || 30;
                    const leftPct = ((start - windowStart) / span) * 100;
                    const naturalWidthPct = (duration / span) * 100;
                    const openVisit = recordHref?.(visit, name);
                    const durationShare = Math.min(1, duration / Math.max(duration, minVisualMinutes));
                    return (
                      <div
                        key={visit.id}
                        className={cn(
                          "group/card absolute z-10 flex min-w-0 flex-col overflow-hidden rounded-2xl border px-3 py-2 shadow-[0_10px_24px_-18px_rgb(7_30_54_/_0.7)] transition-[box-shadow,transform] duration-200 hover:z-30 hover:shadow-[0_18px_40px_-20px_rgb(7_30_54_/_0.55)] focus-within:z-30",
                          visit.status === "in_progress" && "border-oxide bg-mint",
                          visit.status === "arrived" && "border-oxide/40 bg-mint/80",
                          visit.status === "completed" && "border-line bg-mist text-muted",
                          visit.status === "no_show" && "border-dashed border-line bg-card text-muted",
                          visit.status === "cancelled" && "border-dashed border-line bg-card text-muted",
                          visit.status === "scheduled" && "border-line bg-card",
                        )}
                        style={{
                          left: `calc(${leftPct}% + ${GUTTER_REM}rem)`,
                          width: `max(calc(${naturalWidthPct}% - ${GUTTER_REM * 2}rem), ${MIN_CARD_REM}rem)`,
                          top: `${0.45 + lane * laneHeight}rem`,
                          height: `${laneHeight - 0.65}rem`,
                        }}
                      >
                        {openVisit ? (
                          <Link href={openVisit} aria-label={`Record ${name}`} className="absolute inset-0 z-0 rounded-2xl" />
                        ) : null}

                        <div className={cn("relative z-10 flex min-w-0 items-start gap-2.5", openVisit && "pointer-events-none")}>
                          <span
                            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-pine text-[0.7rem] font-semibold text-paper"
                            aria-hidden
                          >
                            {initials(name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            {openVisit ? (
                              <span className="block truncate text-[0.95rem] font-semibold leading-tight">{name}</span>
                            ) : (
                              <Link
                                href={`/try/patients/${visit.patientId}`}
                                className="block truncate text-[0.95rem] font-semibold leading-tight hover:text-oxide"
                              >
                                {name}
                              </Link>
                            )}
                            <p className="mt-0.5 truncate text-xs text-muted">
                              {formatTime(visit.start)}
                              <span className="text-muted/70"> · </span>
                              {duration} min
                            </p>
                            {visit.reason ? (
                              <p className="mt-1 truncate text-sm leading-snug text-ink/80">{visit.reason}</p>
                            ) : null}
                          </div>
                          {openVisit ? (
                            <span className="shrink-0 rounded-full bg-oxide px-2.5 py-1 text-[0.7rem] font-semibold text-paper">
                              Record
                            </span>
                          ) : null}
                        </div>

                        <p
                          className={cn(
                            "relative z-10 mt-auto truncate pt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted",
                            openVisit && "pointer-events-none",
                          )}
                        >
                          {visitTypeLabel[visit.visitType] ?? visit.visitType}
                          {" · "}
                          {visitLabel(visit.status)}
                          {visit.confirmation !== "confirmed" ? ` · ${visitLabel(visit.confirmation)}` : ""}
                        </p>

                        {renderExtra ? <div className="relative z-10 mt-1.5 min-w-0">{renderExtra(visit)}</div> : null}

                        {/* True duration cue when the card is wider than the slot */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute bottom-0 left-0 h-1 rounded-br-2xl rounded-bl-2xl bg-oxide/35"
                          style={{ width: `${Math.max(18, durationShare * 100)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
