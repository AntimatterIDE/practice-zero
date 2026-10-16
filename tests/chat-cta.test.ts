import { describe, expect, it } from "vitest";
import { formatCtaMarker, parseChatCtas } from "@/lib/chat/cta";

describe("parseChatCtas", () => {
  it("extracts marker CTAs and strips them from text", () => {
    const raw = `Optional ad spend is separate.\n${formatCtaMarker("Request a consultation", "/contact")}`;
    const { text, ctas } = parseChatCtas(raw);
    expect(text).toBe("Optional ad spend is separate.");
    expect(ctas).toEqual([{ label: "Request a consultation", href: "/contact" }]);
  });

  it("converts prose visit /contact into a button", () => {
    const { text, ctas } = parseChatCtas(
      "For a detailed consultation to size the agreement, please visit /contact.",
    );
    expect(text.toLowerCase()).not.toContain("/contact");
    expect(ctas.some((c) => c.href === "/contact")).toBe(true);
  });

  it("dedupes paths and prefers contact first", () => {
    const { ctas } = parseChatCtas(
      `Try /try then consult.\n${formatCtaMarker("Request a consultation", "/contact")}\n${formatCtaMarker("Try the demo", "/try")}`,
    );
    expect(ctas[0]?.href).toBe("/contact");
    expect(ctas.filter((c) => c.href === "/try")).toHaveLength(1);
  });
});
