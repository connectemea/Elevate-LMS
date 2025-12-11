import { apiHandler } from '@/lib/api-handler';
import { categoryController } from '@/backend/controllers/category.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id: courseId } = await params;
  const categories = await categoryController.getByCourse(courseId);
  return NextResponse.json({ categories });
});

export const POST = apiHandler<Params>(async (req, { params }) => {
  const { id: courseId } = await params;
  const body = await req.json();
  
  const category = await categoryController.create({
    ...body,
    courseId,
  });
  return NextResponse.json({ category });
});