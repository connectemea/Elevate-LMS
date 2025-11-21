import { NextResponse } from "next/server";
import { sessionService } from "@/backend/services/session.service";

export const SessionController = {
  async create(req: Request) {
    try {
      const body = await req.json();

      const required = ["categoryId", "title", "assetLink", "assetType"];
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const session = await sessionService.create(body);
      return NextResponse.json({ session });
    } catch (err) {
      console.error("Create Session Error:", err);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }
  },

  async update(id: string, req: Request) {
    try {
      const body = await req.json();

      const session = await sessionService.update(id, body);
      return NextResponse.json({ session });
    } catch (err) {
      console.error("Update Session Error:", err);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }
  },

  async remove(id: string) {
    try {
      await sessionService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Delete Session Error:", err);
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: 500 }
      );
    }
  },
};
