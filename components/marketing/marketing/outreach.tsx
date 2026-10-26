"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const messages = [
  {
    kind: "Text",
    to: "Anas Khan",
    detail: "401-555-0174",
    body: "Anas, $40 is still due from the June visit. Reply if you want a statement.",
  },
  {
    kind: "Email",
    to: "Paul Wallace",
    detail: "paul.wallace@example.com",
    body: "Your intake is on file for the 9:00 visit with Dr. Francois. Lab results are in your portal.",
  },
];

export function OutreachSection() {
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState<boolean[]>(() => messages.map(() => false));
  const message = messages[selected];
  const isSent = sent[selected];
  const waiting = sent.filter((item) => !item).length;

  return (
    <CategorySection
      id="outreach"
      eyebrow="Outreach"
      title="The text is written. It has not been sent."
      body="Anas Khan has a balance from the June visit. The message is sitting in the outbox, in this browser, waiting."
    >
      <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Outbox</p>
            <p className="text-xs text-graphite">{waiting === 0 ? "Sent for this morning" : `${waiting} waiting`}</p>
          </div>
          <div className="flex gap-2">
            {messages.map((item, index) => (
              <button
                key={item.kind}
                type="button"
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  index === selected ? "bg-ink text-paper" : "bg-mist text-graphite hover:text-ink",
                )}
              >
                {item.kind}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">
            {message.kind} · {message.detail}
          </p>
          <p className="mt-3 font-display text-3xl text-ink">{message.to}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{message.body}</p>
        </div>
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => setSent((current) => current.map((item, index) => (index === selected ? !item : item)))}
            className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            {isSent ? "Back to the outbox" : "Send"}
          </button>
          <p className="mt-3 text-xs text-graphite" aria-live="polite">
            {isSent ? "Sent from this browser." : "Nothing has been sent."}
          </p>
        </div>
      </article>
    </CategorySection>
  );
}
