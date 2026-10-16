import { describe, expect, it } from "vitest";
import { createSeedState } from "@/lib/rcm/seed";

describe("sample portal chart", () => {
  it("opens Paul Wallace without a password", () => {
    const hale = createSeedState().patients.find((patient) => patient.id === "pt-hale");
    expect(hale?.firstName).toBe("Paul");
    expect(hale?.payerName).toBe("Pinetree Health");
    expect(hale?.intakeAnswers?.length).toBeGreaterThan(0);
    expect(hale?.documents.some((document) => document.status === "signed")).toBe(true);
  });
});
