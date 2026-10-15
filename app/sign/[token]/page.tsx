"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ClinicFrame } from "@/components/clinic/frame";
import { RcmProvider, useRcm } from "@/components/admin/rcm/store";
import { Button } from "@/components/ui/button";
import { samplePractice } from "@/lib/rcm/seed";

export default function SignTokenPage() {
  return (
    <RcmProvider>
      <SignToken />
    </RcmProvider>
  );
}

function SignToken() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const { ready, packets, signPacket } = useRcm();
  const packet = packets.find((item) => item.token === token);
  const [name, setName] = useState(packet?.patientName ?? "");
  const [done, setDone] = useState(false);

  return (
    <ClinicFrame kicker="Document to sign">
      <div className="mx-auto max-w-3xl px-5 py-10">
        {!ready ? <p className="text-sm text-muted">Loading the document…</p> : null}
        {ready && !packet ? (
          <div className="max-w-xl rounded-3xl border border-line bg-card p-6">
            <p className="kicker text-oxide-deep">{samplePractice.legalName}</p>
            <h1 className="mt-3 font-display text-4xl">This link is not valid.</h1>
          </div>
        ) : null}
        {packet && (packet.status === "signed" || done) ? (
          <>
            <p className="kicker text-oxide-deep">Signed</p>
            <h1 className="mt-3 font-display text-4xl">{packet.title}</h1>
            <p className="mt-3 text-muted">Signed by {packet.signerName || name}.</p>
            <article className="mt-6 whitespace-pre-wrap leading-relaxed">{packet.body}</article>
          </>
        ) : null}
        {packet && packet.status === "open" && !done ? (
          <>
            <p className="kicker text-oxide-deep">{samplePractice.legalName}</p>
            <h1 className="mt-3 font-display text-4xl">{packet.title}</h1>
            <p className="mt-4 text-xl">Prepared for {packet.patientName}.</p>
            <article className="mt-6 whitespace-pre-wrap leading-relaxed">{packet.body}</article>
            <form
              className="mt-6 grid max-w-md gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const signed = signPacket(token, name.trim());
                if (signed) setDone(true);
              }}
            >
              <label className="grid gap-2 text-sm">
                <span className="font-medium">Name</span>
                <input className="min-h-11 rounded-xl border border-line px-3" value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <Button type="submit">Sign</Button>
            </form>
          </>
        ) : null}
      </div>
    </ClinicFrame>
  );
}
