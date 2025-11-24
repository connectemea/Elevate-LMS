// app/participants/[id]/page.tsx

import ParticipantDetailPage from "@/components/page/ParticipantDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ParticipantDetailPage participantId={id} />;
}
