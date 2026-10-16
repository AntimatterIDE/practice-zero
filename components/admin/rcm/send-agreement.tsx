"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatWhen } from "@/lib/rcm/format";
import { PacketStatus } from "@/components/admin/agreements-desk";
import { useRcm } from "@/components/admin/rcm/store";

export function SendAgreement({ patientId, name, email }: { patientId: string; name: string; email: string }) {
  const { packets, appendOutbox } = useRcm();
  const [message, setMessage] = useState("");
  const mine = packets.filter((packet) => packet.patientId === patientId);

  return (
    <section className="rounded-2xl border border-line bg-card p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Sign on this site</p>
      <p className="mt-1 text-sm text-muted">
        Sending adds an email to the outbox. The person signs at a link on this demo.{" "}
        <Link href="/try/agreements" className="underline">Agreements</Link>
      </p>
      <Button
        type="button"
        className="mt-3"
        disabled={!email}
        onClick={() => {
          const waiting = mine.find((packet) => packet.status === "open");
          const title = waiting?.title ?? "Consent to evaluate and treat";
          appendOutbox({
            kind: "email",
            to: email,
            body: `${name}, please sign ${title}. ${waiting ? `Open /sign/${waiting.token}` : "The practice will send a link."}`,
          });
          setMessage(`Email to ${email} is in the outbox.`);
        }}
      >
        Send
      </Button>
      <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
        {mine.length === 0 ? <li className="py-3 text-muted">Nothing is on this chart yet. Send one above.</li> : null}
        {mine.map((packet) => (
          <li key={packet.id}>
            <Link
              href={`/try/agreements/${packet.id}`}
              className="group flex items-center justify-between gap-3 py-3"
            >
              <span className="min-w-0">
                <span className="block font-medium group-hover:text-oxide-deep group-hover:underline">{packet.title}</span>
                <span className="mt-0.5 block text-muted">
                  {packet.status === "signed"
                    ? `Signed${packet.signedAt ? ` ${formatWhen(packet.signedAt)}` : ""}`
                    : packet.status === "open"
                      ? "Waiting for a signature"
                      : "Void"}
                  {packet.signerName ? ` · ${packet.signerName}` : ""}
                </span>
              </span>
              <PacketStatus status={packet.status} />
            </Link>
          </li>
        ))}
      </ul>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </section>
  );
}
