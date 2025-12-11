// app/api/participants/stats/route.ts
import { apiHandler } from '@/lib/api-handler';
import { participantController } from '@/backend/controllers/participant.controller';
import { NextResponse } from 'next/server';

export const GET = apiHandler(async () => {
  const stats = await participantController.getStatistics();
  return NextResponse.json(stats);
});