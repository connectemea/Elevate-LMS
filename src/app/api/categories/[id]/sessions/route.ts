import { apiHandler } from '@/lib/api-handler';
import { sessionController } from '@/backend/controllers/session.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (req, { params }) => {
  const { id: categoryId } = await params;
  
  const participantId = req.headers.get('x-user-id');
  const sessions = await sessionController.getByCategory(categoryId, participantId || undefined);
  
  return NextResponse.json({ sessions });
});

export const POST = apiHandler<Params>(async (req, { params }) => {
  const { id: categoryId } = await params;
  const body = await req.json();
  
  const session = await sessionController.create({
    ...body,
    categoryId,
  });
  return NextResponse.json({ session });
});