import { NextResponse } from "next/server";
import { categoryController } from "@/backend/controllers/category.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await categoryController.create(body);

    return NextResponse.json({ category: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
