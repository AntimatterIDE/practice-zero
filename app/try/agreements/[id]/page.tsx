import { AgreementDetail } from "@/components/admin/agreement-detail";

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AgreementDetail id={id} />;
}
