// app/participants/[id]/page.tsx
import ParticipantDetailPage from "@/components/page/ParticipantDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <ParticipantDetailPage participantId={params.id} />;
}
