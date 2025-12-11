import { apiHandler } from '@/lib/api-handler';
import { categoryController } from '@/backend/controllers/category.controller';
import { NextResponse } from 'next/server';

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  
  if (!body.courseId) {
    return NextResponse.json(
      { error: 'courseId is required' },
      { status: 400 }
    );
  }
  
  const result = await categoryController.reorder(body.courseId, body);
  return NextResponse.json({ updated: result.length });
});