import { Suspense } from "react";
import { ClaimsDesk } from "@/components/admin/rcm/claims-desk";

export default function ClaimsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading claims…</p>}>
      <ClaimsDesk />
    </Suspense>
  );
}
