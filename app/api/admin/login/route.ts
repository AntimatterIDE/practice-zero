import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminPasswordMatches, createAdminSessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD?.trim() || !process.env.ADMIN_SESSION_SECRET?.trim()) {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 503 });
  }

  if (!adminPasswordMatches(parsed.data.password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  try {
    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 503 });
  }
}
