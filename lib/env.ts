import { z } from "zod";

const serverEnvSchema = z.object({
  // Optional — production Vercel indexes unless this is explicitly "false".
  INDEXING_ENABLED: z.enum(["true", "false"]).optional(),
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
