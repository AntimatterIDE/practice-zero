"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNav, currentDeskLabel } from "@/components/admin/admin-nav";
import { ResetDemoButton } from "@/components/admin/reset-demo";
import { ExitToHome } from "@/components/marketing/exit-to-home";
import { samplePractice } from "@/lib/rcm/seed";

export function AdminMobileBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const label = currentDeskLabel(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white lg:hidden">
      <div className="flex h-14 items-center gap-2 px-3">
        <ExitToHome />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-neutral-500">{samplePractice.legalName}</p>
          <p className="truncate text-[13px] font-medium text-neutral-900">{label}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-[var(--rb-r-md,8px)] bg-neutral-100 px-3 text-[13px] font-medium text-neutral-800"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-neutral-200 bg-neutral-50 px-2 py-3 text-neutral-900">
          <AdminNav onNavigate={() => setOpen(false)} />
          <div className="mt-4 border-t border-neutral-200 px-3 pt-4">
            <ResetDemoButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
