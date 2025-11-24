import { enrollmentController } from "@/backend/controllers/enrollment.controller";

export async function POST(req: Request) {
  const body = await req.json();
  return enrollmentController.enrollSingle(body);
}