import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_CANONICAL_HOST = "www.practicezero.com";

function canonicalHost() {
  const origin = process.env.CANONICAL_ORIGIN?.replace(/\/$/, "");
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase();
    } catch {
      // fall through
    }
  }
  return DEFAULT_CANONICAL_HOST;
}

/**
 * Production: 301 any non-canonical host (practice0.com, apex, etc.) to
 * www.practicezero.com with the same path + query for SEO consolidation.
 *
 * Also declare UTF-8 on browser document responses so Lighthouse's charset
 * audit passes even when streamed <meta charset> lands after the first
 * 1024 bytes. Skip RSC / prefetch / data requests so we never override
 * their Content-Type.
 */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") {
    const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
    const primary = canonicalHost();
    if (host && host !== primary) {
      const url = request.nextUrl.clone();
      url.protocol = "https:";
      url.host = primary;
      return NextResponse.redirect(url, 301);
    }
  }

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
    // Include .xml / .txt so /sitemap.xml and /robots.txt also host-redirect.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
