import { NextResponse } from "next/server";
import { courseController } from "@/backend/controllers/course.controller";

export async function GET() {
  try {
    const data = await courseController.list();
    return NextResponse.json({ courses: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await courseController.create(body);
    return NextResponse.json({ course: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
