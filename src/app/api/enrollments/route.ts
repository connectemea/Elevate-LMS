import { apiHandler } from "@/lib/api-handler";
import { enrollmentController } from "@/backend/controllers/enrollment.controller";

export const POST = apiHandler(async (req) => {
  const body = await req.json();
    const enrollment = await enrollmentController.enrollSingle(body);
    return { enrollment };
});