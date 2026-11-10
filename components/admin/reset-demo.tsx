"use client";

import { resetDemoState } from "@/components/admin/rcm/store";

export function ResetDemoButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className || "text-[13px] text-graphite underline decoration-line underline-offset-4 hover:text-ink"}
      onClick={() => resetDemoState()}
    >
      Reset demo
    </button>
  );
}
