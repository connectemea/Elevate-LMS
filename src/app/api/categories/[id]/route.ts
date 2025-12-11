import { apiHandler } from '@/lib/api-handler';
import { categoryController } from '@/backend/controllers/category.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  const category = await categoryController.get(id);
  return NextResponse.json({ category });
});

export const PUT = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  
  const updated = await categoryController.update(id, body);
  return NextResponse.json({ category: updated });
});

export const DELETE = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  const deleted = await categoryController.remove(id);
  return NextResponse.json({ deleted: true, id: deleted.id });
});