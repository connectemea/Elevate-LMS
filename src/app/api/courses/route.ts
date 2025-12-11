// app/api/courses/route.ts
import { apiHandler } from '@/lib/api-handler';
import { courseController } from '@/backend/controllers/course.controller';
import { NextResponse } from 'next/server';

export const GET = apiHandler(async () => {
  const data = await courseController.list();
  return NextResponse.json({ courses: data });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const created = await courseController.create(body);
  return NextResponse.json({ course: created });
});