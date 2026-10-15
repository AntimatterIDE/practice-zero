import { z } from "zod";

const serverEnvSchema = z.object({
  INDEXING_ENABLED: z.enum(["true", "false"]).default("false"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function readServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    INDEXING_ENABLED: source.INDEXING_ENABLED || undefined,
  });
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(" ");
    throw new Error(`Invalid environment: ${message}`);
  }
  return parsed.data;
}
