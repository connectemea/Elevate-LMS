import { NextResponse } from "next/server";
import { enrollmentController } from "@/backend/controllers/enrollment.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const enrollment = await enrollmentController.enrollSingle(body);

    return NextResponse.json({ enrollment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
