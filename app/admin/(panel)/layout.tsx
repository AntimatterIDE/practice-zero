import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { BrandMark } from "@/components/marketing/brand-mark";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full bg-paper text-ink">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <BrandMark href="/admin/status" />
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <Link href="/admin/status" className="font-medium text-ink hover:text-slash">
                Status
              </Link>
              <Link href="/admin/leads" className="font-medium text-ink hover:text-slash">
                Leads
              </Link>
              <Link href="/admin/research" className="font-medium text-ink hover:text-slash">
                Research
              </Link>
              <Link href="/admin/marketing" className="font-medium text-ink hover:text-slash">
                Marketing
              </Link>
              <Link href="/admin/compliance" className="font-medium text-ink hover:text-slash">
                Compliance
              </Link>
              <Link href="/admin/funding" className="font-medium text-ink hover:text-slash">
                Funding
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
