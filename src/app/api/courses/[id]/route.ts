// app/api/courses/[id]/route.ts
import { apiHandler } from '@/lib/api-handler';
import { courseController } from '@/backend/controllers/course.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Course ID required' },
      { status: 400 }
    );
  }
  
  // Check if we have participant info from auth
  const participantId = req.headers.get('x-user-id');
  
  const course = await courseController.get(id, participantId || undefined);
  return NextResponse.json({ course });
});

export const PUT = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Course ID required' },
      { status: 400 }
    );
  }
  
  const body = await req.json();
  const updated = await courseController.update(id, body);
  return NextResponse.json({ course: updated });
});

export const DELETE = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Course ID required' },
      { status: 400 }
    );
  }
  
  await courseController.remove(id);
  return NextResponse.json({ success: true });
});