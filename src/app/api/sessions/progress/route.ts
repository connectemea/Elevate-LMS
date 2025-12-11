import { apiHandler } from '@/lib/api-handler';
import { sessionProgressController } from '@/backend/controllers/sessionProgress.controller';
import { NextResponse } from 'next/server';

export const PUT = apiHandler(async (req) => {
  const body = await req.json();
  const progress = await sessionProgressController.update(body);
  return NextResponse.json({ progress });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  
  if (!body.participantId) {
    return NextResponse.json(
      { error: 'participantId is required' },
      { status: 400 }
    );
  }
  
  if (Array.isArray(body.updates)) {
    const result = await sessionProgressController.bulkUpdate(body.participantId, body);
    return NextResponse.json({ results: result });
  }
  
  return NextResponse.json(
    { error: 'Invalid request format' },
    { status: 400 }
  );
});