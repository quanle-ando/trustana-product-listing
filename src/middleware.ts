import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set CSP header
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src * blob: data:",
      "font-src 'self'",
      "connect-src *",
      "frame-src 'none'",
    ].join("; ")
  );

  const cookie = request.cookies.get("session-id");

  if (!cookie) {
    /**
     * Handling of unauthorized access. Normal flow:
     * - User will need to login.
     * - When login action is dispatched, session-id will be set.
     * - From then on, session-id cookie must be present in all calls.
     * - If cookie is not present, redirect to login or unauthorized page.
     */
    // return NextResponse.redirect(new URL("/unauthorized", request.url));

    /**
     * This will be the flow when login action is successful
     */
    const sessionId = crypto.randomUUID();

    response.cookies.set({
      name: "session-id",
      value: sessionId,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}
