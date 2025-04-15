import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const isApiRoute = (req: NextRequest) => {
  return req.nextUrl.pathname.startsWith("/api");
};

const isPublicRoute = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  return (
    path.startsWith("/api") ||
    path.startsWith("/sign-in") ||
    path.startsWith("/webhook") ||
    path === "/top-up-success" ||
    path === "/top-up-cancelled"
  );
};

const soloApiKeyMiddleware = (req: NextRequest) => {
  if (isApiRoute(req)) {
    const header = req.headers.get("authorization");
    if (!header) {
      return new Response("No Authorization header", { status: 401 });
    }
    const token = header.replace("Bearer ", "");
    if (token !== process.env.SOLO_API_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
  return NextResponse.next();
};

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const res = NextResponse.next();

  // Handle CORS preflight
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const isSoloInstance =
    process.env.SOLO_API_KEY && process.env.SOLO_API_KEY.length > 0;

  // Only run API Key auth if Clerk is not enabled
  if (isSoloInstance && !isPublicRoute(req)) {
    return soloApiKeyMiddleware(req);
  }

  return res;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
