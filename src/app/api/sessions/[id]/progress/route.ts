import { apiHandler } from '@/lib/api-handler';
import { sessionProgressController } from '@/backend/controllers/sessionProgress.controller';
import { NextResponse } from 'next/server';
import { sessionProgressService } from '@/backend/services/sessionProgress.service';

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (req, { params }) => {
  const { id: sessionId } = await params;
  
  const participantId = req.headers.get('x-user-id');
  if (!participantId) {
    return NextResponse.json(
      { error: 'Participant ID required' },
      { status: 400 }
    );
  }
  
  const progress = await sessionProgressController.getSessionProgress(sessionId, participantId);
  return NextResponse.json({ progress });
});

export const PUT = apiHandler<Params>(async (req, { params }) => {
  const { id: sessionId } = await params;
  
  const participantId = req.headers.get('x-user-id');
  if (!participantId) {
    return NextResponse.json(
      { error: 'Participant ID required' },
      { status: 400 }
    );
  }
  
  const body = await req.json();
  
  const progress = await sessionProgressService.updateProgress(
    sessionId,
    participantId,
    body.status
  );
  
  return NextResponse.json({ progress });
});