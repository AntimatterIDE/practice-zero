import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { verifyGoliveStatus } from "@/lib/marketing/golive-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const report = await verifyGoliveStatus();
    return NextResponse.json(report);
  } catch (error) {
    console.error("marketing status", error);
    return NextResponse.json({ error: "Status check failed." }, { status: 500 });
  }
}
