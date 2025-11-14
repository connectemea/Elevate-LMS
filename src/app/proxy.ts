import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function proxy(req: NextRequest, _event: NextFetchEvent) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value ?? null,
      },
    }
  );

  const { data } = await supabase.auth.getSession();

  const protectedRoutes = ["/courses", "/participants", "/settings"];
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // redirect when not logged in
  if (isProtected && !data.session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
