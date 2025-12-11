import { apiHandler } from '@/lib/api-handler';
import { enrollmentController } from '@/backend/controllers/enrollment.controller';
import { NextResponse } from 'next/server';

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const enrollment = await enrollmentController.enrollSingle(body);
  return NextResponse.json({ enrollment });
});

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');
  
  if (courseId) {
    const enrollments = await enrollmentController.getEnrollments(courseId);
    return NextResponse.json({ enrollments });
  }
  
  return NextResponse.json({ message: 'Use /courses/[id]/enrollments for specific course' });
});