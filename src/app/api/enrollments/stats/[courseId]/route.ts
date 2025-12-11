import { apiHandler } from '@/lib/api-handler';
import { enrollmentController } from '@/backend/controllers/enrollment.controller';
import { NextResponse } from 'next/server';

type Params = {
  courseId: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { courseId } = await params;
  const stats = await enrollmentController.getStats(courseId);
  return NextResponse.json(stats);
});