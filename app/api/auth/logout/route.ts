import { NextRequest, NextResponse } from "next/server";
import { clearSessionByToken } from "@/lib/auth";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await clearSessionByToken(token);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
