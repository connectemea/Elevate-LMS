import { NextResponse } from "next/server";
import { courseController } from "@/backend/controllers/course.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = await courseController.getAvailableUsers(id);
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
