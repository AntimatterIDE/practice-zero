"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function PatientReach({ email, phone }: { email: string; phone: string }) {
  const { appendOutbox, outbox } = useRcm();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  function send(kind: "email" | "text" | "call", to: string) {
    if (!text.trim() || !to) return;
    appendOutbox({ kind, to, body: text.trim() });
    setMessage(`Added a ${kind} to the outbox.`);
    setText("");
  }

  const related = outbox.filter((item) => item.to === email || item.to === phone);

  return (
    <form
      className="mt-5 rounded-2xl border border-line bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        send("email", email);
      }}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Contact</p>
      <p className="mt-1 text-sm text-muted">Email, text, or call stays in the outbox on this browser.</p>
      <textarea className={`${fieldClass} mt-3 min-h-20`} value={text} maxLength={320} placeholder="Appointment reminder" onChange={(event) => setText(event.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" disabled={!email || !text.trim()}>Email</Button>
        <Button type="button" variant="secondary" disabled={!phone || !text.trim()} onClick={() => send("text", phone)}>
          Text
        </Button>
        <Button type="button" variant="secondary" disabled={!phone || !text.trim()} onClick={() => send("call", phone)}>
          Call
        </Button>
      </div>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      {related.length ? (
        <ul className="mt-4 grid gap-2 text-sm">
          {related.map((item) => (
            <li key={item.id} className="rounded-xl border border-line px-3 py-2">
              <span className="font-medium capitalize">{item.kind}</span>
              <span className="mt-1 block text-muted">{item.body}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
