import { NextResponse } from "next/server";

export function apiHandler(
  handler: (req: Request, ctx?: any) => Promise<any>
) {
  return async (req: Request, ctx?: any) => {
    try {
      const result = await handler(req, ctx);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error("API ERROR:", error);

      const status = error.status || 500;

      return NextResponse.json(
        {
          error: error.message || "Internal Server Error",
          details: process.env.NODE_ENV === "development" ? error : undefined,
        },
        { status }
      );
    }
  };
}
