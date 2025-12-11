import { apiHandler } from '@/lib/api-handler';
import { sessionProgressController } from '@/backend/controllers/sessionProgress.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
  courseId: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id: participantId, courseId } = await params;
  
  const progress = await sessionProgressController.getCourseProgress(participantId, courseId);
  return NextResponse.json(progress);
});