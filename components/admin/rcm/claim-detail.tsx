"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { claimTotal, formatDay, formatWhen, money, patientBalance, patientName } from "@/lib/rcm/format";
import type { Claim, ClaimStatus } from "@/lib/rcm/types";
import { AccountNoteDialog } from "@/components/admin/rcm/account-note";
import { Field, LoadingDesk, PageHeader, StatusPill, fieldClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

const localStatuses: ClaimStatus[] = ["draft", "held", "ready", "submitted", "processing", "accepted", "paid", "denied", "rejected"];

function appealLetter(claim: Claim, name: string, practiceName: string) {
  const line = claim.lines[0];
  return [
    "Appeals department,",
    "",
    `Please reconsider claim ${claim.controlNumber} for ${name}, date of service ${formatDay(claim.dateOfService)}.`,
    line ? `${line.cpt} ${line.description} was reported with ${line.icd || "the documented diagnosis"}.` : "The reported services were medically necessary.",
    claim.denialReason ? `The denial reason on file is: ${claim.denialReason}.` : "",
    claim.carc ? `CARC ${claim.carc}${claim.rarc ? `, RARC ${claim.rarc}` : ""}.` : "",
    "",
    "This letter stays in the chart. It has not been sent.",
    practiceName,
  ].filter((paragraph) => paragraph !== "").join("\n");
}

export function ClaimDetail({ id }: { id: string }) {
  const { ready, claims, patients, practice, updateClaim, submitLocalClaim } = useRcm();
  const claim = claims.find((item) => item.id === id);
  const patient = patients.find((item) => item.id === claim?.patientId);
  const [noteOpen, setNoteOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [allowed, setAllowed] = useState("");
  const [planPaid, setPlanPaid] = useState("");
  const [remitReason, setRemitReason] = useState("");
  const [writeOff, setWriteOff] = useState("");

  if (!ready) return <LoadingDesk />;
  if (!claim || !patient) {
    return (
      <main>
        <h1 className="font-display text-4xl">Claim not found</h1>
        <Link href="/try/claims" className="mt-4 inline-block text-sm underline">Back to claims</Link>
      </main>
    );
  }

  const balance = patientBalance(claim);
  const physician = claim.lines.find((line) => line.physician)?.physician;

  return (
    <main>
      {noteOpen ? <AccountNoteDialog notes={patient.accountNotes} onClose={() => setNoteOpen(false)} /> : null}
      <PageHeader
        kicker={claim.controlNumber}
        title={patientName(patient)}
        lede={`${claim.payerName} · ${formatDay(claim.dateOfService)} · Place of service ${claim.placeOfService} · Billing provider ${practice.legalName}${physician ? ` · Treating ${physician}` : ""}`}
        action={<StatusPill status={claim.status} />}
      />
      <p className="mt-4 text-sm text-muted">
        <Link href={`/try/patients/${patient.id}`} className="underline">Open chart</Link>
        {" · "}
        {money(claimTotal(claim))} billed
        {claim.paymentAmount != null ? ` · ${money(claim.paymentAmount)} paid` : ""}
        {claim.returnReason ? ` · ${claim.returnReason}` : ""}
      </p>
      {claim.holdReason ? <p className="mt-4 rounded-2xl border border-line bg-mist p-4 text-sm">Held: {claim.holdReason}</p> : null}
      {claim.denialReason ? (
        <p className="mt-4 rounded-2xl border border-line bg-red-50 p-4 text-sm text-emergency">
          {claim.denialReason}
          {claim.carc ? ` · CARC ${claim.carc}` : ""}
          {claim.rarc ? ` · RARC ${claim.rarc}` : ""}
        </p>
      ) : null}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {claim.lines.map((line) => (
          <li key={line.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
            <span>
              <span className="block font-semibold">
                {line.cpt}
                {line.modifiers.length ? `-${line.modifiers.join("-")}` : ""} · {line.description}
              </span>
              <span className="text-muted">
                {line.diagnoses.join(", ") || "No diagnosis"} · {line.units} unit{line.units === 1 ? "" : "s"}
                {line.physician ? ` · ${line.physician}` : ""}
                {line.includeOnBill ? "" : " · left off the bill"}
              </span>
            </span>
            <span>{money(line.charge * line.units)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {claim.status === "draft" || claim.status === "held" || claim.status === "ready" ? (
          <Button asChild variant="secondary">
            <Link href={`/try/claims/new?patient=${patient.id}&claim=${claim.id}${claim.appointmentId ? `&visit=${claim.appointmentId}` : ""}`}>Edit charges</Link>
          </Button>
        ) : null}
        {claim.status === "draft" || claim.status === "held" || claim.status === "ready" || claim.status === "submitted" || claim.status === "processing" ? (
          <Button type="button" onClick={() => setMessage(submitLocalClaim(claim.id))}>
            Submit claim
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link href={`/try/claims/${claim.id}/print`}>Print preview</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/try/claims/${claim.id}/statement`}>Patient statement</Link>
        </Button>
      </div>
      {message ? <p className="mt-4 max-w-2xl text-sm text-muted">{message}</p> : null}
      <section className="mt-6 max-w-2xl rounded-2xl border border-line bg-card p-4 text-sm">
        <h2 className="font-display text-2xl">Ledger</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><dt className="text-muted">Practice fee</dt><dd>{money(claimTotal(claim))}</dd></div>
          <div><dt className="text-muted">Collected at the visit</dt><dd>{money(claim.collectedAmount ?? 0)}</dd></div>
          <div><dt className="text-muted">Plan paid the practice</dt><dd>{money(claim.paymentAmount ?? 0)}</dd></div>
          <div><dt className="text-muted">Balance</dt><dd>{money(balance)}</dd></div>
        </dl>
        {claim.allowedAmount != null ? <p className="mt-3 text-muted">Allowed amount on the EOB: {money(claim.allowedAmount)}. This is the plan’s figure, not a contracted fee.</p> : null}
        {claim.remitReason ? <p className="mt-2">{claim.remitReason}</p> : null}
        {claim.adjustmentAmount ? <p className="mt-2 text-muted">Write-off recorded: {money(claim.adjustmentAmount)}</p> : null}
        <p className="mt-3 text-muted">The statement uses this same balance. It has not been mailed.</p>
      </section>
      <form
        className="mt-4 grid max-w-2xl gap-3 rounded-2xl border border-line bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const paid = Number(planPaid);
          const allowedAmount = Number(allowed);
          if (allowed.trim() === "" || planPaid.trim() === "" || !Number.isFinite(paid) || !Number.isFinite(allowedAmount)) {
            setMessage("Enter the allowed amount and what the plan paid the practice.");
            return;
          }
          const next = {
            ...claim,
            paymentAmount: paid,
            allowedAmount,
            remitReason: remitReason.trim(),
          };
          updateClaim(claim.id, {
            paymentAmount: paid,
            allowedAmount,
            remitReason: remitReason.trim(),
            patientResponsibility: patientBalance(next),
            events: [
              ...claim.events,
              {
                id: `ev-${crypto.randomUUID()}`,
                at: new Date().toISOString(),
                kind: "835",
                summary: remitReason.trim() || `Plan paid ${money(paid)}.`,
              },
            ],
          });
          setMessage("EOB recorded. No write-off was added.");
        }}
      >
        <h2 className="font-display text-2xl">Record EOB</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Allowed amount">
            <input className={fieldClass} inputMode="decimal" value={allowed} onChange={(event) => setAllowed(event.target.value)} />
          </Field>
          <Field label="Plan paid the practice">
            <input className={fieldClass} inputMode="decimal" value={planPaid} onChange={(event) => setPlanPaid(event.target.value)} />
          </Field>
        </div>
        <Field label="Reason">
          <input className={fieldClass} value={remitReason} onChange={(event) => setRemitReason(event.target.value)} />
        </Field>
        <Button type="submit" variant="secondary">Record EOB</Button>
      </form>
      <form
        className="mt-4 flex max-w-2xl flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const amount = Number(writeOff);
          if (writeOff.trim() === "" || !Number.isFinite(amount) || amount < 0) {
            setMessage("Enter the write-off amount.");
            return;
          }
          const next = { ...claim, adjustmentAmount: amount };
          updateClaim(claim.id, { adjustmentAmount: amount, patientResponsibility: patientBalance(next) });
          setMessage("Write-off recorded. The claim status did not change.");
        }}
      >
        <Field label="Write-off">
          <input className={fieldClass} inputMode="decimal" value={writeOff} onChange={(event) => setWriteOff(event.target.value)} placeholder={String(balance)} />
        </Field>
        <Button type="submit" variant="secondary">Write off</Button>
      </form>
      <div className="mt-4 grid max-w-2xl gap-3">
        <Field label="Note to the payer">
          <textarea
            className={`${fieldClass} min-h-24`}
            defaultValue={claim.payerNote ?? ""}
            key={`${claim.id}-payer-note`}
            onBlur={(event) => {
              if (event.target.value === (claim.payerNote ?? "")) return;
              updateClaim(claim.id, { payerNote: event.target.value });
            }}
          />
        </Field>
        <Field label="Attachment">
          <input
            className={fieldClass}
            defaultValue={claim.attachmentName ?? ""}
            key={`${claim.id}-attachment`}
            placeholder="Report or image file name"
            onBlur={(event) => {
              if (event.target.value === (claim.attachmentName ?? "")) return;
              updateClaim(claim.id, { attachmentName: event.target.value });
            }}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(claim.attachmentRequired)}
            onChange={(event) => updateClaim(claim.id, { attachmentRequired: event.target.checked })}
          />
          This claim needs a report or image before it can be filed
        </label>
        <p className="text-sm text-muted">A missing attachment holds the claim. It does not add a patient charge. Chart history and files stay on the chart.</p>
      </div>
      {claim.events.length ? (
        <ol className="mt-6 grid gap-2">
          {claim.events.map((event) => (
            <li key={event.id} className="rounded-xl border border-line bg-card px-4 py-3 text-sm">
              <span className="text-muted">{formatWhen(event.at)} · {event.kind}</span>
              <span className="mt-1 block">{event.summary}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="mt-8">
        <p className="text-sm font-medium">Record a status in this browser</p>
        <p className="mt-1 text-sm text-muted">These buttons stay on this chart. Marking paid does not record a payment or a write-off.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {localStatuses.map((status) => (
            <Button key={status} type="button" variant={claim.status === status ? "primary" : "secondary"} onClick={() => updateClaim(claim.id, { status })}>
              {status}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            updateClaim(claim.id, {
              appealDraft: appealLetter(claim, patientName(patient), practice.legalName),
              resolution: "appeal",
            })
          }
        >
          Draft appeal
        </Button>
      </div>
      {claim.appealDraft ? <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-line bg-card p-4 text-sm">{claim.appealDraft}</pre> : null}
    </main>
  );
}
