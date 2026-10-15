import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const recipients = [
  "paul@antimatterai.com",
  "robby@antimatterai.com",
  "dannie@antimatterai.com",
  "anas@antimatterai.com",
] as const;

const bodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(120),
  size: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function notifyTeam(data: z.infer<typeof bodySchema>) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  // Without a verified domain From address, Resend sandbox rejects team recipients.
  if (!apiKey || !from) return;

  const resend = new Resend(apiKey);
  const subject = `Consultation request · ${data.company}`;
  const text = [
    "New practice zero consultation request",
    "",
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Practice: ${data.company}`,
    `Role: ${data.title}`,
    `Practice size: ${data.size}`,
    `Phone: ${data.phone || "—"}`,
    "",
    "Message:",
    data.message || "—",
    "",
    "View in admin: /admin/leads",
  ].join("\n");

  const html = `
    <div style="font-family:Instrument Sans,Helvetica,Arial,sans-serif;color:#111418;line-height:1.5">
      <p style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#2D4BF0;font-weight:600">practice zero</p>
      <h1 style="font-size:24px;letter-spacing:-0.03em;margin:8px 0 20px">Consultation request</h1>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#4A4F57">Name</td><td style="padding:8px 0">${escapeHtml(`${data.firstName} ${data.lastName}`)}</td></tr>
        <tr><td style="padding:8px 0;color:#4A4F57">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#4A4F57">Practice</td><td style="padding:8px 0">${escapeHtml(data.company)}</td></tr>
        <tr><td style="padding:8px 0;color:#4A4F57">Role</td><td style="padding:8px 0">${escapeHtml(data.title)}</td></tr>
        <tr><td style="padding:8px 0;color:#4A4F57">Practice size</td><td style="padding:8px 0">${escapeHtml(data.size)}</td></tr>
        <tr><td style="padding:8px 0;color:#4A4F57">Phone</td><td style="padding:8px 0">${escapeHtml(data.phone || "—")}</td></tr>
      </table>
      <p style="margin:24px 0 8px;color:#4A4F57">Message</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message || "—")}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: [...recipients],
      replyTo: data.email,
      subject,
      text,
      html,
    });
  } catch {
    // Email is best-effort. Leads live in the admin panel.
  }
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("consultation_leads").insert({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      practice_name: data.company,
      role: data.title,
      practice_size: data.size,
      phone: data.phone || null,
      message: data.message || null,
      source: "contact",
      status: "new",
    });

    if (error) {
      console.error("consultation_leads insert failed", error.message);
      return NextResponse.json({ error: "Could not save the request." }, { status: 502 });
    }
  } catch (error) {
    console.error("consultation_leads unavailable", error);
    return NextResponse.json({ error: "Could not save the request." }, { status: 503 });
  }

  // Never fail the request on email issues (Resend sandbox / unverified domain).
  void notifyTeam(data);

  return NextResponse.json({ ok: true });
}
