import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const banned = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "createSupabaseAdminClient",
  "STEDI_API_KEY",
  "BIRD_API_KEY",
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
];

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (entry === "node_modules" || entry === ".next" || entry === ".git") return [];
    if (statSync(fullPath).isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

describe("demo has no vendor keys", () => {
  it("does not mention live vendor credentials", () => {
    const files = ["app", "components", "lib"].flatMap((directory) => walk(directory));
    const hits: string[] = [];
    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
      const source = readFileSync(file, "utf8");
      for (const term of banned) {
        if (source.includes(term)) hits.push(`${file}: ${term}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
