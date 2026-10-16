import type { Metadata } from "next";
import { RcmProvider } from "@/components/admin/rcm/store";
import { PatientPortalShell } from "@/components/patient-portal/shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Patient experience",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RcmProvider>
      <PatientPortalShell>{children}</PatientPortalShell>
    </RcmProvider>
  );
}
