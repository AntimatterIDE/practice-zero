import { describe, expect, it } from "vitest";
import { isDemoDeskPath, isMarketingAnalyticsPath } from "@/lib/analytics/paths";
import { getSpecialty, specialties } from "@/lib/marketing/specialties";
import { publishedResearchCatalog } from "@/lib/research/catalog";

describe("specialty landers", () => {
  it("ships the Wave 1 specialty set", () => {
    expect(specialties.map((s) => s.slug).sort()).toEqual(
      ["dermatology", "ob-gyn", "ophthalmology", "orthopedics", "primary-care"].sort(),
    );
  });

  it("resolves each specialty with full lander content", () => {
    for (const specialty of specialties) {
      expect(getSpecialty(specialty.slug)?.label).toBe(specialty.label);
      expect(specialty.support.length).toBeGreaterThan(120);
      expect(specialty.reality.title.length).toBeGreaterThan(10);
      expect(specialty.reality.body.length).toBeGreaterThan(120);
      expect(specialty.howWeHelp.length).toBeGreaterThanOrEqual(4);
      expect(specialty.board.length).toBe(4);
      expect(specialty.zeroOut.length).toBeGreaterThanOrEqual(4);
      expect(specialty.faq.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("analytics path gating", () => {
  it("allows marketing routes", () => {
    expect(isMarketingAnalyticsPath("/")).toBe(true);
    expect(isMarketingAnalyticsPath("/specialties/orthopedics")).toBe(true);
    expect(isMarketingAnalyticsPath("/contact")).toBe(true);
  });

  it("blocks portal, admin, and demo desks from full suite", () => {
    expect(isMarketingAnalyticsPath("/portal")).toBe(false);
    expect(isMarketingAnalyticsPath("/admin/leads")).toBe(false);
    expect(isMarketingAnalyticsPath("/try")).toBe(false);
    expect(isDemoDeskPath("/try/claims")).toBe(true);
  });
});

describe("SEO research briefs", () => {
  it("includes Wave 1 Semrush-briefed articles", () => {
    const slugs = publishedResearchCatalog.map((article) => article.slug);
    expect(slugs.some((slug) => slug.includes("collections-pricing"))).toBe(true);
    expect(slugs.some((slug) => slug.includes("beyond-per-seat"))).toBe(true);
    expect(slugs.some((slug) => slug.includes("specialty-mornings"))).toBe(true);
  });

  it("keeps the original notes and adds the seven product headlines", () => {
    expect(publishedResearchCatalog).toHaveLength(26);
    const titles = publishedResearchCatalog.map((article) => article.title);
    for (const headline of [
      "The practice fee is collected at the visit",
      "One outstanding balance across visits",
      "What the desk collects before someone leaves",
      "Book the return from the note",
      "A completed visit shows claim sent or claim pending send",
      "The practice adds a new patient from the chart list",
      "Five specialty landers, one morning board",
    ]) {
      expect(titles.some((title) => title.startsWith(headline))).toBe(true);
    }
    expect(titles.some((title) => title.startsWith("Specialty mornings on a horizontal agentic EHR"))).toBe(true);
  });
});
