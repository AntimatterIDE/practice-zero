import { describe, expect, it } from "vitest";
import { LAB_BOOT_SNIFF } from "@/lib/lab-environment";

describe("lab-environment", () => {
  it("exports a boot sniff covering HeadlessChrome and session intro gating", () => {
    expect(LAB_BOOT_SNIFF).toContain("HeadlessChrome");
    expect(LAB_BOOT_SNIFF).toContain("userAgentData");
    expect(LAB_BOOT_SNIFF).toContain("pz-intro-v2");
    expect(LAB_BOOT_SNIFF).toContain("webdriver");
  });
});
