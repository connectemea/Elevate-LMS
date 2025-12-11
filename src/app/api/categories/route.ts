import { apiHandler } from '@/lib/api-handler';
import { categoryController } from '@/backend/controllers/category.controller';
import { NextResponse } from 'next/server';

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const category = await categoryController.create(body);
  return NextResponse.json({ category });
});