import { apiHandler } from '@/lib/api-handler';
import { sessionController } from '@/backend/controllers/session.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  
  const participantId = req.headers.get('x-user-id');
  const session = await sessionController.get(id, participantId || undefined);
  
  return NextResponse.json({ session });
});

export const PUT = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  
  const updated = await sessionController.update(id, body);
  return NextResponse.json({ session: updated });
});

export const DELETE = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  const deleted = await sessionController.remove(id);
  return NextResponse.json({ deleted: true, id: deleted.id });
});