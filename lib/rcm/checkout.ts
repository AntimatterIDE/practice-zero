import { claimTotal } from "@/lib/rcm/format";
import type { Appointment, Claim, VisitNote } from "@/lib/rcm/types";

const atCounterStatus = new Set(["arrived", "in_progress", "completed"]);

export type CheckoutBrief = {
  atCounter: boolean;
  scheduledDescription: string;
  scheduledFee: number;
  collected: number;
  addOns: { description: string; cpt: string; fee: number }[];
  addOnTotal: number;
  /** What the desk still collects before the patient leaves. Add-ons are not on the bill yet. */
  collectNow: number;
  onTheBill: boolean;
  followUp: string | null;
  followUpBooked: { start: string; reason: string } | null;
  needsBooking: boolean;
};

export function followUpFromNote(note: VisitNote | undefined) {
  if (!note) return null;
  if (note.followUp?.trim()) return note.followUp.trim();
  const match = /return in [^.\n]+/i.exec(note.note);
  if (!match) return null;
  const text = match[0].trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function checkoutBrief(input: {
  visit: Appointment;
  claims: Claim[];
  notes: VisitNote[];
  appointments: Appointment[];
}): CheckoutBrief {
  const { visit, claims, notes, appointments } = input;
  const claim = claims.find((item) => item.appointmentId === visit.id);
  const scheduledFee = claim ? claimTotal(claim) : 0;
  const collected = claim?.collectedAmount ?? 0;
  const addOns = visit.addOns.map((item) => ({ description: item.description, cpt: item.cpt, fee: item.fee }));
  const addOnTotal = addOns.reduce((sum, item) => sum + item.fee, 0);
  const note = notes.find((item) => item.appointmentId === visit.id);
  const followUp = followUpFromNote(note);
  const later = appointments.find(
    (item) =>
      item.id !== visit.id &&
      item.patientId === visit.patientId &&
      item.start > visit.start &&
      item.status !== "cancelled" &&
      item.status !== "no_show",
  );
  const atCounter = atCounterStatus.has(visit.status);
  return {
    atCounter,
    scheduledDescription: claim?.lines[0]?.description || visit.reason,
    scheduledFee,
    collected,
    addOns,
    addOnTotal,
    collectNow: Math.max(0, scheduledFee - collected) + addOnTotal,
    onTheBill: Boolean(claim),
    followUp,
    followUpBooked: later ? { start: later.start, reason: later.reason } : null,
    needsBooking: atCounter && Boolean(followUp) && !later,
  };
}
