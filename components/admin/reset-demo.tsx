"use client";

import { resetDemoState } from "@/components/admin/rcm/store";

export function ResetDemoButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className || "text-[13px] text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"}
      onClick={() => resetDemoState()}
    >
      Reset demo
    </button>
  );
}
