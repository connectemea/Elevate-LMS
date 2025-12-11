import { apiHandler } from '@/lib/api-handler';
import { enrollmentController } from '@/backend/controllers/enrollment.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const DELETE = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  await enrollmentController.remove(id);
  return NextResponse.json({ success: true });
});