import type { ClaimStatus } from "@/lib/rcm/types";

export function nextLocalClaimStatus(status: ClaimStatus): ClaimStatus | null {
  if (status === "draft" || status === "held" || status === "ready" || status === "submitted" || status === "processing") {
    return "accepted";
  }
  return null;
}
