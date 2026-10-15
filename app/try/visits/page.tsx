import { Suspense } from "react";
import { VisitDesk } from "@/components/admin/visit-desk";
import { LoadingDesk } from "@/components/admin/rcm/ui";

export default function VisitsPage() {
  return (
    <Suspense fallback={<LoadingDesk />}>
      <VisitDesk />
    </Suspense>
  );
}
