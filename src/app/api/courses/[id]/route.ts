//   { params }: { params: Promise<{ id: string }> }
import { NextResponse, NextRequest } from "next/server";
import { courseController } from "@/backend/controllers/course.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const participantId = new URL(req.url).searchParams.get("participantId") ?? undefined;

    const data = await courseController.get(id, { participantId });
    return NextResponse.json({ course: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await courseController.update(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await courseController.remove(id);
    return NextResponse.json({ deleted: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
