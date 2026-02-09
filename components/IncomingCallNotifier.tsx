"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type IncomingCallEvent = {
  callId: string;
  threadId: string;
  startedById: string;
  startedByName: string;
  threadTitle: string;
  startedAt: string;
};

export function IncomingCallNotifier() {
  const pathname = usePathname();
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<IncomingCallEvent | null>(null);
  const [dismissedCallIds, setDismissedCallIds] = useState<string[]>([]);

  const activeThreadPath = useMemo(() => {
    const parts = pathname.split("/");
    return parts[1] === "chat" && parts[2] ? parts[2] : null;
  }, [pathname]);

  useEffect(() => {
    const source = new EventSource("/api/calls/stream");

    const onIncomingCall = (event: Event) => {
      try {
        const raw = event as MessageEvent<string>;
        const payload = JSON.parse(raw.data) as IncomingCallEvent;

        if (!payload.callId || !payload.threadId) return;
        if (dismissedCallIds.includes(payload.callId)) return;
        if (activeThreadPath === payload.threadId) return;

        setIncomingCall(payload);
      } catch {
        // Ignore malformed real-time payloads.
      }
    };

    const onCallEnded = (event: Event) => {
      try {
        const raw = event as MessageEvent<string>;
        const payload = JSON.parse(raw.data) as { callId?: string };

        if (!payload.callId) return;
        setIncomingCall((current) => (current?.callId === payload.callId ? null : current));
      } catch {
        // Ignore malformed real-time payloads.
      }
    };

    source.addEventListener("call.incoming", onIncomingCall);
    source.addEventListener("call.ended", onCallEnded);

    return () => {
      source.removeEventListener("call.incoming", onIncomingCall);
      source.removeEventListener("call.ended", onCallEnded);
      source.close();
    };
  }, [activeThreadPath, dismissedCallIds]);

  function onAnswer() {
    if (!incomingCall) return;
    router.push(`/chat/${incomingCall.threadId}`);
    setIncomingCall(null);
  }

  function onDismiss() {
    if (!incomingCall) return;
    setDismissedCallIds((existing) => [...existing, incomingCall.callId]);
    setIncomingCall(null);
  }

  if (!incomingCall) return null;

  return (
    <div className="global-call-popup">
      <div className="thread-title">Incoming Call</div>
      <div className="thread-meta">
        {incomingCall.startedByName} is calling in {incomingCall.threadTitle || "Direct chat"}.
      </div>
      <div className="global-call-popup-actions">
        <button className="tab" onClick={onAnswer} type="button">
          Open Chat
        </button>
        <button className="tab danger-tab" onClick={onDismiss} type="button">
          Dismiss
        </button>
      </div>
    </div>
  );
}
