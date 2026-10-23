import { describe, expect, it } from "vitest";
import { createSeedState } from "@/lib/rcm/seed";
import { nextLocalClaimStatus } from "@/lib/rcm/submit-input";

describe("local claim and eligibility fixture", () => {
  it("keeps a canned eligibility result on the 9:00 patient", () => {
    const state = createSeedState();
    const check = state.eligibility.find((item) => item.patientId === "pt-hale");
    expect(check?.active).toBe(true);
    expect(check?.copay).toBeNull();
    expect(check?.serviceBenefit).toBe(true);
    expect(check?.coinsurance).toBe(30);
    expect(check?.deductibleRemaining).toBe(650);
    expect(check?.summary).toMatch(/out-of-network/i);
    expect(check?.summary).toMatch(/\$185/);
    expect(check?.priorAuthRequired).toBe(false);
    const auth = state.eligibility.find((item) => item.patientId === "pt-voss");
    expect(auth?.priorAuthRequired).toBe(true);
  });

  it("moves a draft claim to accepted locally", () => {
    const draft = createSeedState().claims.find((claim) => claim.id === "clm-hale");
    expect(draft?.status).toBe("draft");
    expect(nextLocalClaimStatus(draft!.status)).toBe("accepted");
  });
});
