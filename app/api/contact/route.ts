import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

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

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email delivery is not configured yet. Add RESEND_API_KEY and try again." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL || "practice zero <onboarding@resend.dev>";
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

  const { error } = await resend.emails.send({
    from,
    to: [...recipients],
    replyTo: data.email,
    subject,
    text,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Email could not be sent." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
