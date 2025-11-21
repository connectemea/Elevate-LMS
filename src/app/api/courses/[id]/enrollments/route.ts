import { NextResponse } from "next/server";
import { courseController } from "@/backend/controllers/course.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await courseController.getEnrollments(id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const enrolled = await courseController.enrollParticipants(id, body.participantIds);
    return NextResponse.json(enrolled);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
