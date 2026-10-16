import { notFound } from "next/navigation";
import { ResearchEditor } from "@/components/admin/research-editor";
import { getResearchById } from "@/lib/research/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminResearchEditorPage({ params }: Props) {
  const { id } = await params;
  let article = null;
  try {
    article = await getResearchById(id);
  } catch {
    notFound();
  }
  if (!article) notFound();

  return <ResearchEditor article={article} />;
}
