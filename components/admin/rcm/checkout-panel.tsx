import Link from "next/link";
import { formatTime, money } from "@/lib/rcm/format";
import type { CheckoutBrief } from "@/lib/rcm/checkout";

export function CheckoutPanel({
  brief,
  patientName,
  patientId,
}: {
  brief: CheckoutBrief;
  patientName: string;
  patientId: string;
}) {
  return (
    <div className="grid gap-3 text-left text-ink">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-oxide">At the counter</p>
        <p className="mt-1 font-display text-3xl tracking-tight">{money(brief.collectNow)}</p>
        <p className="mt-1 text-sm text-muted">Collect this before {patientName} leaves.</p>
      </div>
      <dl className="grid gap-2 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted">
            {brief.onTheBill ? "On the bill" : "This visit"}
            <span className="mt-0.5 block text-ink">{brief.scheduledDescription}</span>
          </dt>
          <dd className="shrink-0 text-right">
            {brief.onTheBill ? money(brief.scheduledFee) : "No bill yet"}
            {brief.collected > 0 ? <span className="mt-0.5 block text-xs text-muted">{money(brief.collected)} collected</span> : null}
          </dd>
        </div>
        {brief.addOns.length === 0 ? (
          <div className="text-muted">Nothing was added during the visit.</div>
        ) : (
          brief.addOns.map((item) => (
            <div key={item.cpt + item.description} className="flex items-start justify-between gap-3">
              <dt>
                Added in the room
                <span className="mt-0.5 block text-muted">
                  {item.description}
                  {item.cpt ? ` · ${item.cpt}` : ""}
                  <span className="block">Not on the bill yet</span>
                </span>
              </dt>
              <dd className="shrink-0 font-medium">{money(item.fee)}</dd>
            </div>
          ))
        )}
      </dl>
      {brief.needsBooking ? (
        <div className="rounded-2xl border border-oxide/40 bg-mint px-3 py-3" role="alert">
          <p className="text-sm font-medium">Book the return before they leave.</p>
          <p className="mt-1 text-sm text-muted">The note says {brief.followUp}. That visit is not on the schedule.</p>
          <Link href={`/try/scheduling?patient=${patientId}`} className="mt-2 inline-block text-sm font-semibold text-oxide hover:underline">
            Book the return
          </Link>
        </div>
      ) : brief.followUpBooked ? (
        <p className="text-sm text-muted">
          Return is already on the schedule, {formatTime(brief.followUpBooked.start)}.
        </p>
      ) : null}
    </div>
  );
}
