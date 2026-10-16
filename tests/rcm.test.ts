import { describe, expect, it } from "vitest";
import { parsePracticeCsv } from "@/lib/rcm/import";
import { summarizeClaims } from "@/lib/rcm/metrics";
import { createSeedState } from "@/lib/rcm/seed";
import { nextLocalClaimStatus } from "@/lib/rcm/submit-input";

describe("practice desk fixture", () => {
  it("parses a patient and claim csv", () => {
    const parsed = parsePracticeCsv(
      ["first,last,dob,payer,member,dos,cpt,description,charge,icd", "Elena,Voss,1984-04-12,Aetna,AET1,2026-09-28,99214,Office visit,210,M54.5"].join(
        "\n",
      ),
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.rows[0]).toMatchObject({ firstName: "Elena", charge: 210, cpt: "99214" });
  });

  it("rejects a csv without the expected columns", () => {
    const parsed = parsePracticeCsv("name,charge\nElena,10");
    expect(parsed.ok).toBe(false);
  });

  it("starts from the connected sample morning", () => {
    const state = createSeedState();
    expect(state.practice.legalName).toBe("Northline Medical");
    expect(state.practice.physicianName).toBe("Amina Shah, MD");
    expect(state.patients.map((patient) => patient.id)).toEqual(["pt-hale", "pt-voss", "pt-adelman"]);
    expect(state.appointments).toHaveLength(3);
    expect(state.tasks.filter((task) => task.status === "open")).toHaveLength(2);
    expect(state.packets.filter((packet) => packet.status === "open")).toHaveLength(4);
    expect(state.claims.find((claim) => claim.id === "clm-hale")?.status).toBe("draft");
    expect(state.claims.find((claim) => claim.id === "clm-voss-denial")?.status).toBe("denied");
    expect(state.claims.find((claim) => claim.id === "clm-voss-paid")?.status).toBe("paid");
    expect(state.outbox.map((item) => item.kind).sort()).toEqual(["email", "text"]);
    expect(state.agentRuns.map((run) => run.href)).toEqual([
      "/try/eligibility",
      "/try/visits",
      "/try/claims/clm-hale",
      "/try/patients/pt-voss",
    ]);
    expect(state.visitNotes[0]?.revealed).toBe(false);
  });

  it("summarizes the fixture claims", () => {
    const summary = summarizeClaims(createSeedState().claims);
    expect(summary.billed).toBeGreaterThan(0);
  });

  it("accepts a draft without leaving the browser", () => {
    expect(nextLocalClaimStatus("draft")).toBe("accepted");
    expect(nextLocalClaimStatus("paid")).toBeNull();
  });
});
