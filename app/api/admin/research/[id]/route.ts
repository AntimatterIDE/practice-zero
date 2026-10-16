import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteResearchArticle,
  publishResearchArticle,
  updateResearchArticle,
} from "@/lib/research/store";

export const runtime = "nodejs";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  excerpt: z.string().trim().max(2000).optional(),
  topic: z.string().trim().max(200).optional(),
  cover_image_url: z.string().url().nullable().optional(),
  cover_credit: z.string().trim().max(200).nullable().optional(),
  search_title: z.string().trim().max(80).optional(),
  search_description: z.string().trim().max(200).optional(),
  keywords: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
      }),
    )
    .optional(),
  sources: z
    .array(
      z.object({
        kind: z.string(),
        year: z.string(),
        title: z.string(),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
  read_minutes: z.number().int().min(1).max(30).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  action: z.enum(["publish", "unpublish"]).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  try {
    if (parsed.data.action === "publish") {
      const article = await publishResearchArticle(id);
      return NextResponse.json({ article });
    }

    const { action, ...rest } = parsed.data;
    if (action === "unpublish") {
      const article = await updateResearchArticle(id, {
        status: "draft",
        published_at: null,
      });
      return NextResponse.json({ article });
    }

    const article = await updateResearchArticle(id, rest);
    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await deleteResearchArticle(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
