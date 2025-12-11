import { apiHandler } from '@/lib/api-handler';
import { courseController } from '@/backend/controllers/course.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Course ID required' },
      { status: 400 }
    );
  }
  
  const enrollments = await courseController.getEnrollments(id);
  return NextResponse.json({ enrollments });
});

export const POST = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Course ID required' },
      { status: 400 }
    );
  }
  
  const body = await req.json();
  
  if (!body.participantIds || !Array.isArray(body.participantIds)) {
    return NextResponse.json(
      { error: 'participantIds array is required' },
      { status: 400 }
    );
  }
  
  const result = await courseController.enrollParticipants(id, body.participantIds);
  return NextResponse.json(result);
});