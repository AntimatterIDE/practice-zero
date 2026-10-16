"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { samplePractice } from "@/lib/rcm/seed";

export default function PortalLoginPage() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/portal");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[1.75rem] border border-line bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-slash text-sm font-semibold text-paper">
            PZ
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{samplePractice.legalName}</p>
            <p className="text-xs text-graphite">Patient portal · sample login</p>
          </div>
        </div>

        <h1 className="mt-8 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
          sign in to your record.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-graphite">
          Demo credentials are prefilled. Continue to walk Paul Wallace’s patient experience.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-graphite">Email</span>
            <input
              name="email"
              type="email"
              defaultValue="paul.wallace@email.com"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-slash"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-graphite">Password</span>
            <input
              name="password"
              type="password"
              defaultValue="demo-password"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-slash"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slash px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            <Lock className="h-4 w-4" />
            Enter patient experience
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-graphite">
          Practice view instead?{" "}
          <Link href="/try" className="font-medium text-slash hover:text-oxide-deep">
            Try the demo
          </Link>
        </p>
      </div>
    </div>
  );
}
