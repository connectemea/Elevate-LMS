import { apiHandler } from '@/lib/api-handler';
import { participantController } from '@/backend/controllers/participant.controller';
import { NextResponse } from 'next/server';

export const GET = apiHandler(async () => {
  const participants = await participantController.list();
  return NextResponse.json({ participants });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  
  if (Array.isArray(body.participants)) {
    // Bulk create
    const result = await participantController.bulkCreate(body);
    return NextResponse.json(result);
  } else {
    // Single create
    const participant = await participantController.create(body);
    return NextResponse.json({ participant });
  }
});