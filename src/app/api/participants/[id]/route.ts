import { apiHandler } from '@/lib/api-handler';
import { participantController } from '@/backend/controllers/participant.controller';
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  const participant = await participantController.get(id);
  return NextResponse.json({ participant });
});

export const PUT = apiHandler<Params>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  
  const updated = await participantController.update(id, body);
  return NextResponse.json({ participant: updated });
});

export const DELETE = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;
  const result = await participantController.remove(id);
  return NextResponse.json(result);
});