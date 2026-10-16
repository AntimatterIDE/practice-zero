import { describe, expect, it } from "vitest";
import {
  COMPLIANCE_TRACKS,
  complianceStepKey,
  countComplianceSteps,
} from "@/lib/compliance/tasks";
import { COMPLIANCE_KNOWLEDGE } from "@/lib/compliance/knowledge";

describe("compliance tasks", () => {
  it("has seven numbered tracks with discrete steps", () => {
    expect(COMPLIANCE_TRACKS).toHaveLength(7);
    expect(COMPLIANCE_TRACKS.map((t) => t.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const track of COMPLIANCE_TRACKS) {
      expect(track.steps.length).toBeGreaterThanOrEqual(3);
      const stepIds = new Set(track.steps.map((s) => s.id));
      expect(stepIds.size).toBe(track.steps.length);
      expect(track.badge.length).toBeGreaterThan(0);
    }
  });

  it("covers the marketing compliance badges", () => {
    const badges = new Set(COMPLIANCE_TRACKS.map((t) => t.badge));
    expect(badges.has("HIPAA")).toBe(true);
    expect(badges.has("SOC 2 Type II")).toBe(true);
    expect(badges.has("AES-256")).toBe(true);
    expect(badges.has("BAA available")).toBe(true);
    expect(badges.has("99.9% uptime")).toBe(true);
  });

  it("builds stable step keys and counts steps", () => {
    expect(complianceStepKey("quick-wins", "qw-vercel-baa")).toBe(
      "quick-wins::qw-vercel-baa",
    );
    expect(countComplianceSteps()).toBeGreaterThan(30);
  });

  it("includes actionable vendor links on quick wins", () => {
    const quick = COMPLIANCE_TRACKS.find((t) => t.id === "quick-wins");
    expect(quick).toBeTruthy();
    const withLinks = quick!.steps.filter((s) => (s.links?.length ?? 0) > 0);
    expect(withLinks.length).toBeGreaterThanOrEqual(5);
  });

  it("knowledge brief warns against inventing certifications", () => {
    expect(COMPLIANCE_KNOWLEDGE).toMatch(/Never invent/i);
    expect(COMPLIANCE_KNOWLEDGE).toMatch(/localStorage/i);
  });
});
