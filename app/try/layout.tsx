import type { Metadata } from "next";
import { DemoOpenTracker } from "@/components/analytics/demo-open-tracker";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileBar } from "@/components/admin/admin-mobile-bar";
import { ResetDemoButton } from "@/components/admin/reset-demo";
import { RcmProvider } from "@/components/admin/rcm/store";
import { ExitToHome } from "@/components/marketing/exit-to-home";
import { samplePractice } from "@/lib/rcm/seed";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-white lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <DemoOpenTracker />
      <aside className="hidden border-r border-neutral-200 bg-neutral-50 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-neutral-200 px-3">
          <ExitToHome className="w-full justify-start" />
        </div>
        <div className="flex items-center gap-2.5 px-3 py-3">
          <span className="grid size-8 place-items-center rounded-md bg-neutral-900 text-[11px] font-semibold text-white">PZ</span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-neutral-900">{samplePractice.legalName}</p>
            <p className="text-xs text-neutral-500">Practice desk · demo</p>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          <AdminNav />
        </div>
        <div className="shrink-0 space-y-2 bg-neutral-100/70 p-3">
          <p className="truncate text-[13px] font-medium text-neutral-900">{samplePractice.physicianName}</p>
          <p className="text-xs text-neutral-500">Sample practice</p>
          <ResetDemoButton />
        </div>
      </aside>
      <div className="admin-canvas min-w-0 max-w-full overflow-x-clip">
        <AdminMobileBar />
        <RcmProvider>
          <div className="min-w-0 max-w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </RcmProvider>
      </div>
    </div>
  );
}
