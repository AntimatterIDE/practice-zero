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

  it("resolves each specialty", () => {
    for (const specialty of specialties) {
      expect(getSpecialty(specialty.slug)?.label).toBe(specialty.label);
      expect(specialty.zeroOut.length).toBe(3);
      expect(specialty.faq.length).toBe(3);
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
});
