"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminLogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className={cn(
        "rounded-full border border-line px-4 py-2 text-sm text-graphite hover:text-ink",
        className,
      )}
    >
      Sign out
    </button>
  );
}
