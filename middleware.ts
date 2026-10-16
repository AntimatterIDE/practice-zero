import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Declare UTF-8 on browser document responses so Lighthouse's charset audit
 * passes even when streamed <meta charset> lands after the first 1024 bytes.
 * Skip RSC / prefetch / data requests so we never override their Content-Type.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.method !== "GET") return response;
  if (request.headers.get("rsc") === "1") return response;
  if (request.headers.get("next-router-prefetch")) return response;
  if (request.headers.get("next-router-state-tree")) return response;

  const accept = request.headers.get("accept") ?? "";
  const isDocument =
    accept.includes("text/html") &&
    !accept.includes("text/x-component") &&
    !accept.includes("_react");

  if (isDocument) {
    response.headers.set("Content-Type", "text/html; charset=utf-8");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
