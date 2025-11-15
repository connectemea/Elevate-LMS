import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach((cookie) => {
            res.cookies.set(cookie);
          });
        },
      },
    }
  );

  // SAFE & VERIFIED
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const protectedRoutes = ["/courses", "/participants", "/settings"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const url = new URL("/login", req.url);
    url.searchParams.set("msg", "401");
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    "/courses/:path*",
    "/participants/:path*",
    "/settings/:path*",
  ],
};
