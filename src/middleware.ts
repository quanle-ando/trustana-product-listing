import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

const TRACKING_ID = nanoid();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-tracking-id", TRACKING_ID);

  const cookie = request.cookies.get("session-id");

  if (!cookie) {
    // Generate a new session ID (e.g. UUID or random string)
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
