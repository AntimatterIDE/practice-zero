import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { draftResearchArticle } from "@/lib/research/draft";
import { createResearchArticle } from "@/lib/research/store";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  topic: z.string().trim().min(2).max(200),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Topic is required." }, { status: 400 });
  }

  try {
    const { draft, usedModel } = await draftResearchArticle(parsed.data.topic);
    const article = await createResearchArticle({
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      topic: parsed.data.topic,
      cover_image_url: draft.cover_image_url,
      cover_credit: draft.cover_credit,
      search_title: draft.search_title,
      search_description: draft.search_description,
      keywords: draft.keywords,
      sections: draft.sections,
      sources: draft.sources,
      read_minutes: draft.read_minutes,
      status: "draft",
    });

    return NextResponse.json({ article, usedModel });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Draft failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
