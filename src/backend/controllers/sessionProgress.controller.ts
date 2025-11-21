import { NextResponse } from "next/server";
import { sessionProgressService } from "@/backend/services/sessionProgress.service";
import { SessionStatus } from "@prisma/client";

export const sessionProgressController = {
  async update(req: Request) {
    try {
      const { sessionId, participantId, status } = await req.json();

      if (!sessionId || !participantId || !status) {
        return NextResponse.json(
          { error: "sessionId, participantId and status required" },
          { status: 400 }
        );
      }

      if (!Object.values(SessionStatus).includes(status)) {
        return NextResponse.json(
          { error: "Invalid session status" },
          { status: 400 }
        );
      }

      const result = await sessionProgressService.updateProgress(
        sessionId,
        participantId,
        status as SessionStatus
      );

      return NextResponse.json({ sessionProgress: result });
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to update session progress", detail: error.message },
        { status: 500 }
      );
    }
  },
};
