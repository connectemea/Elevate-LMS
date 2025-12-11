import ParticipantCourseDetailPage from "@/components/page/ParticipantCourseDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; courseId: string }>;
}) {
  const { id, courseId } = await params;

  return <ParticipantCourseDetailPage participantId={id} courseId={courseId} />;
}