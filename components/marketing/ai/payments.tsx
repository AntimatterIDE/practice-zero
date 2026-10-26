"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const lines = [
  {
    who: "Pinetree Health",
    what: "Anas Khan · June visit",
    amount: "$140",
    detail: "Posted to the practice on June 20.",
  },
  {
    who: "Patient balance",
    what: "Anas Khan · still due",
    amount: "$40",
    detail: "Open. The text is the next touch.",
    sent: "The balance text is in the outbox.",
  },
];

export function AiPaymentsSection() {
  const [selected, setSelected] = useState(1);
  const [sent, setSent] = useState(false);
  const line = lines[selected];

  return (
    <CategorySection
      id="payments"
      flip
      eyebrow="Payments"
      title="The payment is already on the ledger."
      body="The plan paid $140. $40 is still the patient balance. Payment tracking stays open without another spreadsheet."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Ledger</p>
          <p className="text-xs text-graphite">June visit · Anas Khan</p>
        </div>
        <div>
          {lines.map((item, index) => {
            const open = index === selected;
            return (
              <button
                key={item.who}
                type="button"
                aria-pressed={open}
                onClick={() => setSelected(index)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-4 border-t border-line px-5 py-4 text-left first:border-t-0",
                  open ? "bg-mist" : "hover:bg-paper",
                )}
              >
                <span>
                  <span className="block text-sm font-medium text-ink">{item.who}</span>
                  <span className="mt-1 block text-xs text-graphite">{item.what}</span>
                </span>
                <span className="font-display text-2xl text-ink">{item.amount}</span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-line px-5 py-4">
          <p className="max-w-sm text-sm leading-relaxed text-graphite" aria-live="polite">
            {selected === 1 && sent ? lines[1].sent : line.detail}
          </p>
          {selected === 1 && (
            <button
              type="button"
              onClick={() => setSent((value) => !value)}
              className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
            >
              {sent ? "Pull it back" : "Send the balance text"}
            </button>
          )}
        </div>
      </div>
    </CategorySection>
  );
}
