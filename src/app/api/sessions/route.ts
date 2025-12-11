import { apiHandler } from '@/lib/api-handler';
import { sessionController } from '@/backend/controllers/session.controller';
import { NextResponse } from 'next/server';

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const session = await sessionController.create(body);
  return NextResponse.json({ session });
});