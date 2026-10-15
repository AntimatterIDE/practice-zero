import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminIndexPage() {
  if (await isAdminAuthenticated()) redirect("/admin/leads");
  redirect("/admin/login");
}
