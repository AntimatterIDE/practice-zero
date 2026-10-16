import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Instantly → Practice Zero lead sync.
 * Configure Instantly webhook to POST interested / replied leads here.
 * Auth: Authorization: Bearer <INSTANTLY_WEBHOOK_SECRET>
 */
const payloadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional().default(""),
  lastName: z.string().trim().max(80).optional().default(""),
  first_name: z.string().trim().max(80).optional(),
  last_name: z.string().trim().max(80).optional(),
  company: z.string().trim().max(120).optional().default(""),
  practiceName: z.string().trim().max(120).optional(),
  practice_name: z.string().trim().max(120).optional(),
  specialty: z.string().trim().max(120).optional().default(""),
  campaign: z.string().trim().max(120).optional().default(""),
  campaign_name: z.string().trim().max(120).optional(),
  event: z.string().trim().max(80).optional().default("interested"),
  reply: z.string().trim().max(4000).optional().default(""),
  message: z.string().trim().max(4000).optional(),
});

function bearerOk(request: Request) {
  const expected = process.env.INSTANTLY_WEBHOOK_SECRET?.trim();
  if (!expected) return false;
  const header = request.headers.get("authorization")?.trim() ?? "";
  const token = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : header;
  return token === expected;
}

export async function POST(request: Request) {
  if (!bearerOk(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  const firstName = data.firstName || data.first_name || "Unknown";
  const lastName = data.lastName || data.last_name || "Lead";
  const practiceName =
    data.practiceName || data.practice_name || data.company || "Unknown practice";
  const campaign = data.campaign || data.campaign_name || null;
  const message =
    data.message ||
    data.reply ||
    `Instantly event: ${data.event}${campaign ? ` · ${campaign}` : ""}`;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("consultation_leads").insert({
      email: data.email,
      first_name: firstName,
      last_name: lastName,
      practice_name: practiceName,
      role: "Outbound lead",
      practice_size: "Unknown",
      phone: null,
      message,
      source: "cold_email",
      specialty: data.specialty || null,
      campaign,
      utm_source: "cold",
      utm_medium: "email",
      utm_campaign: campaign,
      utm_content: data.event,
      utm_term: null,
      status: "new",
    });

    if (error) {
      console.error("instantly webhook insert failed", error.message);
      return NextResponse.json({ error: "Could not save lead" }, { status: 502 });
    }
  } catch (error) {
    console.error("instantly webhook unavailable", error);
    return NextResponse.json({ error: "Could not save lead" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
