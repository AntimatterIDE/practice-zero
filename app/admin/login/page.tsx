"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/marketing/brand-mark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Could not sign in.");
      }
      router.replace("/admin/status");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-sm">
        <BrandMark href={null} />
        <h1 className="mt-8 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
          admin
        </h1>
        <p className="mt-2 text-sm text-graphite">Sign in to review consultation leads.</p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-ink">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink outline-none focus:border-slash focus:ring-2 focus:ring-slash/30"
            />
          </label>
          {error ? <p className="text-sm text-emergency">{error}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-slash px-5 py-3 text-sm font-medium text-paper hover:bg-oxide-deep disabled:opacity-70"
          >
            {sending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
