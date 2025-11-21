import { NextResponse } from "next/server";
import { participantService } from "@/backend/services/participant.service";

export const ParticipantController = {
  async getAll() {
    try {
      const participants = await participantService.getAll();
      return NextResponse.json({ participants });
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to fetch participants" },
        { status: 500 }
      );
    }
  },

  async create(req: Request) {
    try {
      const payload = await req.json();
      const participant = await participantService.create(payload);
      return NextResponse.json({ participant });
    } catch (err: any) {
      if (err.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create participant", details: err.message },
        { status: 500 }
      );
    }
  },

  async get(id: string) {
    const p = await participantService.getById(id);
    if (!p) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ participant: p });
  },

  async update(id: string, req: Request) {
    const body = await req.json();
    const updated = await participantService.update(id, body);
    return NextResponse.json({ participant: updated });
  },

  async remove(id: string) {
    await participantService.deleteById(id);
    return NextResponse.json({ success: true });
  },
};
