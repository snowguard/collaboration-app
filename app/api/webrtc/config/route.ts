import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/api-auth";

function parseUrls(raw: string | undefined, fallback: string[]) {
  if (!raw) return fallback;
  const urls = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return urls.length > 0 ? urls : fallback;
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stunUrls = parseUrls(process.env.WEBRTC_STUN_URLS, ["stun:stun.l.google.com:19302"]);
  const turnUrls = parseUrls(process.env.WEBRTC_TURN_URLS, []);
  const turnUsername = process.env.WEBRTC_TURN_USERNAME?.trim();
  const turnCredential = process.env.WEBRTC_TURN_CREDENTIAL?.trim();

  const iceServers: RTCIceServer[] = [{ urls: stunUrls }];

  if (turnUrls.length > 0 && turnUsername && turnCredential) {
    iceServers.push({
      urls: turnUrls,
      username: turnUsername,
      credential: turnCredential
    });
  }

  return NextResponse.json({ iceServers });
}
