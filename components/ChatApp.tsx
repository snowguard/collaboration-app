"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";

type UserDirectory = { id: string; name: string; email: string; online: boolean };
type ThreadMember = { id: string; name: string; email: string; role: "OWNER" | "ADMIN" | "MEMBER" };
type ThreadItem = {
  id: string;
  title: string;
  isDirect: boolean;
  updatedAt: string;
  members: ThreadMember[];
  lastMessage: { body: string; senderName: string; createdAt: string } | null;
};

type MessageItem = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
};

type LinkItem = {
  id: string;
  url: string;
  createdAt: string;
  message: { id: string; body: string; sender: { name: string } };
};

type SearchResultItem = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
  threadId: string;
  threadTitle: string;
};

type ActiveCall = {
  id: string;
  threadId: string;
  startedById: string;
  startedAt: string;
  status: "ACTIVE";
  isRecording?: boolean;
  recordingStartedById?: string | null;
  recordingStartedAt?: string | null;
  participants: Array<{
    userId: string;
    joinedAt: string;
    leftAt: string | null;
    user: { id: string; name: string; email: string };
  }>;
};

type CallSignalPayload = {
  threadId: string;
  callId: string;
  fromUserId: string;
  toUserId: string | null;
  type: "offer" | "answer" | "ice-candidate";
  payload: unknown;
};

type WebRtcConfigResponse = {
  iceServers?: RTCIceServer[];
};

type LiveTranscriptSegment = {
  startSec: number | null;
  endSec: number | null;
  text: string;
  confidence: number | null;
};

interface Props {
  currentUser: { id: string; name: string; email: string; role: "USER" | "ADMIN" };
  initialThreadId?: string;
}

const fallbackRtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

function IconButton({
  title,
  onClick,
  disabled,
  children
}: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button className="icon-btn" disabled={disabled} onClick={onClick} title={title} type="button">
      {children}
    </button>
  );
}

export function ChatApp({ currentUser, initialThreadId }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [users, setUsers] = useState<UserDirectory[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [tab, setTab] = useState<"messages" | "links">("messages");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const [isGroupManageModalOpen, setIsGroupManageModalOpen] = useState(false);
  const [groupEditName, setGroupEditName] = useState("");
  const [groupActionBusy, setGroupActionBusy] = useState(false);

  const [callInfo, setCallInfo] = useState<ActiveCall | null>(null);
  const [callStatus, setCallStatus] = useState("Idle");
  const [callBusy, setCallBusy] = useState(false);
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [isIncomingCallPromptOpen, setIsIncomingCallPromptOpen] = useState(false);
  const [dismissedIncomingCallId, setDismissedIncomingCallId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBusy, setRecordingBusy] = useState(false);
  const [inviteUserId, setInviteUserId] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [transcriptFilePath, setTranscriptFilePath] = useState("");
  const [meetingReportPath, setMeetingReportPath] = useState("");
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remotePeerUserIdRef = useRef<string | null>(null);
  const callIdRef = useRef<string | null>(null);
  const rtcConfigPromiseRef = useRef<Promise<RTCConfiguration> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const liveLocalRecorderRef = useRef<MediaRecorder | null>(null);
  const liveRemoteRecorderRef = useRef<MediaRecorder | null>(null);
  const liveLocalStreamRef = useRef<MediaStream | null>(null);
  const liveRemoteStreamRef = useRef<MediaStream | null>(null);
  const liveLocalFlushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveRemoteFlushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptionSessionIdRef = useRef<string | null>(null);
  const liveChunkQueueRef = useRef<Array<{ blob: Blob; speaker: string }>>([]);
  const liveChunkDrainRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const parts = pathname.split("/");
    setThreadId(parts[1] === "chat" && parts[2] ? parts[2] : undefined);
  }, [pathname]);

  async function loadThreads() {
    const response = await fetch("/api/threads", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setThreads(payload.threads ?? []);
  }

  async function loadUsers() {
    const response = await fetch("/api/users", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setUsers(payload.users ?? []);
  }

  async function loadMessages(id: string, query: string) {
    const url = query
      ? `/api/threads/${id}/messages?search=${encodeURIComponent(query)}`
      : `/api/threads/${id}/messages`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setMessages(payload.messages ?? []);
  }

  async function loadLinks(id: string) {
    const response = await fetch(`/api/threads/${id}/links`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setLinks(payload.links ?? []);
  }

  async function loadCall(id: string) {
    const response = await fetch(`/api/threads/${id}/call`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setCallInfo(payload.call ?? null);
    callIdRef.current = payload.call?.id ?? null;
  }

  useEffect(() => {
    void loadThreads();
    void loadUsers();
    void getRtcConfig();

    const threadsTimer = setInterval(() => void loadThreads(), 12000);
    const usersTimer = setInterval(() => void loadUsers(), 9000);

    return () => {
      clearInterval(threadsTimer);
      clearInterval(usersTimer);
    };
  }, []);

  useEffect(() => {
    if (!threadId) return;
    void loadMessages(threadId, "");
    void loadLinks(threadId);
  }, [threadId]);

  function setVideoElementStream(ref: RefObject<HTMLVideoElement | null>, stream: MediaStream | null) {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }

  function cleanupRtc(stopLocal: boolean) {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    remoteStreamRef.current = null;
    setVideoElementStream(remoteVideoRef, null);
    remotePeerUserIdRef.current = null;

    if (stopLocal && localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        track.stop();
      }
      localStreamRef.current = null;
      setVideoElementStream(localVideoRef, null);
    }
  }

  function stopRecordingStreamTracks() {
    if (!recordingStreamRef.current) return;
    for (const track of recordingStreamRef.current.getTracks()) {
      track.stop();
    }
    recordingStreamRef.current = null;
  }

  async function uploadRecording(blob: Blob) {
    const extension = blob.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `call-recording.${extension}`, { type: blob.type || "video/webm" });
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/calls/recordings", {
      method: "POST",
      body: formData
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || "Failed to save call recording.");
      return;
    }

    if (typeof payload?.path === "string" && payload.path) {
      setCallStatus(`Recording saved: ${payload.path}`);
    }
  }

  async function startCallRecording() {
    if (isRecording || recordingBusy) return;

    const stream = new MediaStream();
    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        stream.addTrack(track);
      }
    }
    if (remoteStreamRef.current) {
      for (const track of remoteStreamRef.current.getTracks()) {
        stream.addTrack(track);
      }
    }

    if (stream.getTracks().length === 0) {
      setError("No active media stream to record.");
      return;
    }

    const mimeCandidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4"
    ];
    const selectedMime = mimeCandidates.find((value) => MediaRecorder.isTypeSupported(value));

    try {
      const recorder = selectedMime ? new MediaRecorder(stream, { mimeType: selectedMime }) : new MediaRecorder(stream);
      recordingChunksRef.current = [];
      recordingStreamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const chunks = recordingChunksRef.current;
        const type = recorder.mimeType || "video/webm";
        recordingChunksRef.current = [];
        mediaRecorderRef.current = null;
        setIsRecording(false);
        void postCallAction("recording_stop");
        stopRecordingStreamTracks();

        if (chunks.length === 0) return;

        const recordingBlob = new Blob(chunks, { type });
        setRecordingBusy(true);
        void uploadRecording(recordingBlob).finally(() => setRecordingBusy(false));
      };

      recorder.start(1000);
      setIsRecording(true);
      void postCallAction("recording_start");
      setCallStatus("Recording...");
      setError("");
    } catch {
      setError("Unable to start recording in this browser.");
      stopRecordingStreamTracks();
    }
  }

  function stopCallRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "inactive") return;
    recorder.stop();
  }

  function stopLiveTranscriptionTracks() {
    if (liveLocalStreamRef.current) {
      for (const track of liveLocalStreamRef.current.getTracks()) {
        track.stop();
      }
      liveLocalStreamRef.current = null;
    }
    if (liveRemoteStreamRef.current) {
      for (const track of liveRemoteStreamRef.current.getTracks()) {
        track.stop();
      }
      liveRemoteStreamRef.current = null;
    }
  }

  function formatTranscriptClock(totalSeconds: number | null) {
    if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds) || totalSeconds < 0) return "--:--";
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function appendLiveTranscriptLines(lines: string[]) {
    if (lines.length === 0) return;
    setLiveTranscript((existing) => {
      const next = existing ? `${existing}\n${lines.join("\n")}` : lines.join("\n");
      return next.length > 16000 ? next.slice(next.length - 16000) : next;
    });
  }

  async function transcribeLiveChunk(blob: Blob, speaker: string) {
    if (!threadId) return;

    const extension = blob.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `call-chunk.${extension}`, { type: blob.type || "audio/webm" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("speaker", speaker);

    if (transcriptionSessionIdRef.current) {
      formData.append("sessionId", transcriptionSessionIdRef.current);
    }
    formData.append("threadLabel", activeThread?.title || "Collaboration");

    const response = await fetch(`/api/threads/${threadId}/call/transcribe`, {
      method: "POST",
      body: formData
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || "Live transcription failed.");
      return;
    }

    if (typeof payload?.sessionId === "string" && payload.sessionId) {
      transcriptionSessionIdRef.current = payload.sessionId;
    }
    if (typeof payload?.filePath === "string" && payload.filePath) {
      setTranscriptFilePath(payload.filePath);
    }
    if (typeof payload?.reportFilePath === "string" && payload.reportFilePath) {
      setMeetingReportPath(payload.reportFilePath);
    }

    const segments = Array.isArray(payload?.segments)
      ? (payload.segments as LiveTranscriptSegment[])
      : [];

    if (segments.length > 0) {
      appendLiveTranscriptLines(
        segments
          .filter((segment) => Boolean(segment?.text?.trim()))
          .map((segment) => {
            const start = formatTranscriptClock(segment.startSec);
            const end = formatTranscriptClock(segment.endSec);
            const confidence =
              typeof segment.confidence === "number" ? ` conf=${segment.confidence.toFixed(2)}` : "";
            return `[${start}-${end}] [${speaker}]${confidence} ${segment.text.trim()}`;
          })
      );
      return;
    }

    if (typeof payload?.text === "string" && payload.text.trim()) {
      appendLiveTranscriptLines([`[--:--] [${speaker}] ${payload.text.trim()}`]);
    }
  }

  async function drainLiveChunkQueue() {
    while (liveChunkQueueRef.current.length > 0) {
      const next = liveChunkQueueRef.current.shift();
      if (!next) continue;
      await transcribeLiveChunk(next.blob, next.speaker);
    }
  }

  function enqueueLiveChunk(blob: Blob, speaker: string) {
    liveChunkQueueRef.current.push({ blob, speaker });
    if (liveChunkDrainRef.current) return;

    liveChunkDrainRef.current = drainLiveChunkQueue().finally(() => {
      liveChunkDrainRef.current = null;
      if (liveChunkQueueRef.current.length > 0) {
        liveChunkDrainRef.current = drainLiveChunkQueue().finally(() => {
          liveChunkDrainRef.current = null;
        });
      }
    });
  }

  function createLiveRecorderForSource(
    speaker: string,
    sourceStream: MediaStream,
    targetRecorderRef: { current: MediaRecorder | null },
    targetStreamRef: { current: MediaStream | null },
    flushTimerRef: { current: ReturnType<typeof setInterval> | null }
  ) {
    if (targetRecorderRef.current) return;
    const audioTracks = sourceStream.getAudioTracks();
    if (audioTracks.length === 0) return;

    const stream = new MediaStream();
    for (const track of audioTracks) {
      stream.addTrack(track);
    }

    const mimeCandidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
    const selectedMime = mimeCandidates.find((value) => MediaRecorder.isTypeSupported(value));
    const recorder = selectedMime ? new MediaRecorder(stream, { mimeType: selectedMime }) : new MediaRecorder(stream);

    targetStreamRef.current = stream;
    targetRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (!event.data || event.data.size === 0) return;
      enqueueLiveChunk(event.data, speaker);
    };

    recorder.onstop = () => {
      targetRecorderRef.current = null;
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      if (targetStreamRef.current) {
        for (const track of targetStreamRef.current.getTracks()) {
          track.stop();
        }
        targetStreamRef.current = null;
      }

      if (!liveLocalRecorderRef.current && !liveRemoteRecorderRef.current) {
        setIsLiveTranscribing(false);
      }
    };

    recorder.start();
    flushTimerRef.current = setInterval(() => {
      if (recorder.state === "recording") {
        recorder.requestData();
      }
    }, 3000);
  }

  async function startLiveTranscription() {
    if (isLiveTranscribing || !userIsInCall) return;

    if (!localStreamRef.current && !remoteStreamRef.current) {
      setError("No audio stream available for live transcription.");
      return;
    }

    try {
      if (localStreamRef.current) {
        createLiveRecorderForSource(
          localSpeakerName,
          localStreamRef.current,
          liveLocalRecorderRef,
          liveLocalStreamRef,
          liveLocalFlushTimerRef
        );
      }
      if (remoteStreamRef.current) {
        createLiveRecorderForSource(
          remoteSpeakerName,
          remoteStreamRef.current,
          liveRemoteRecorderRef,
          liveRemoteStreamRef,
          liveRemoteFlushTimerRef
        );
      }

      if (!liveLocalRecorderRef.current && !liveRemoteRecorderRef.current) {
        setError("No audio tracks available for live transcription.");
        return;
      }

      setIsLiveTranscribing(true);
      setError("");
    } catch {
      setError("Unable to start live transcription in this browser.");
      stopLiveTranscriptionTracks();
    }
  }

  function stopLiveTranscription() {
    const stopRecorder = (recorder: MediaRecorder | null) => {
      if (!recorder) return;
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };

    stopRecorder(liveLocalRecorderRef.current);
    stopRecorder(liveRemoteRecorderRef.current);
    if (liveLocalFlushTimerRef.current) {
      clearInterval(liveLocalFlushTimerRef.current);
      liveLocalFlushTimerRef.current = null;
    }
    if (liveRemoteFlushTimerRef.current) {
      clearInterval(liveRemoteFlushTimerRef.current);
      liveRemoteFlushTimerRef.current = null;
    }
    liveLocalRecorderRef.current = null;
    liveRemoteRecorderRef.current = null;
    setIsLiveTranscribing(false);
    stopLiveTranscriptionTracks();
  }

  async function ensureLocalMedia() {
    if (localStreamRef.current) return localStreamRef.current;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("This browser does not support audio/video calling.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current = stream;
    setVideoElementStream(localVideoRef, stream);
    setIsMicEnabled(true);
    setIsCamEnabled(true);
    return stream;
  }

  async function postSignal(
    currentThreadId: string,
    callId: string,
    type: "offer" | "answer" | "ice-candidate",
    payload: unknown,
    toUserId?: string
  ) {
    await fetch(`/api/threads/${currentThreadId}/call/signal`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ callId, type, toUserId, payload })
    });
  }

  async function getRtcConfig() {
    if (rtcConfigPromiseRef.current) return rtcConfigPromiseRef.current;

    rtcConfigPromiseRef.current = (async () => {
      const response = await fetch("/api/webrtc/config", { cache: "no-store" });
      if (!response.ok) return fallbackRtcConfig;

      const payload = (await response.json().catch(() => ({}))) as WebRtcConfigResponse;
      const iceServers =
        payload.iceServers && payload.iceServers.length > 0
          ? payload.iceServers
          : fallbackRtcConfig.iceServers;

      return { iceServers } as RTCConfiguration;
    })();

    return rtcConfigPromiseRef.current;
  }

  async function ensurePeerConnection(currentThreadId: string, callId: string, peerUserId: string) {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const connection = new RTCPeerConnection(await getRtcConfig());
    peerConnectionRef.current = connection;
    remotePeerUserIdRef.current = peerUserId;
    callIdRef.current = callId;

    const stream = await ensureLocalMedia();
    for (const track of stream.getTracks()) {
      connection.addTrack(track, stream);
    }
    if (userIsInCall && !isLiveTranscribing) {
      void startLiveTranscription();
    }

    connection.ontrack = (event) => {
      const [streamFromPeer] = event.streams;
      if (!streamFromPeer) return;
      remoteStreamRef.current = streamFromPeer;
      setVideoElementStream(remoteVideoRef, streamFromPeer);
      if (userIsInCall && isLiveTranscribing && !liveRemoteRecorderRef.current) {
        createLiveRecorderForSource(
          remoteSpeakerName,
          streamFromPeer,
          liveRemoteRecorderRef,
          liveRemoteStreamRef,
          liveRemoteFlushTimerRef
        );
      }
    };

    connection.onicecandidate = (event) => {
      if (!event.candidate || !remotePeerUserIdRef.current || !callIdRef.current) return;
      void postSignal(
        currentThreadId,
        callIdRef.current,
        "ice-candidate",
        { candidate: event.candidate.toJSON() },
        remotePeerUserIdRef.current
      );
    };

    connection.onconnectionstatechange = () => {
      if (!peerConnectionRef.current) return;
      if (peerConnectionRef.current.connectionState === "connected") setCallStatus("Connected");
      if (
        peerConnectionRef.current.connectionState === "failed" ||
        peerConnectionRef.current.connectionState === "disconnected"
      ) {
        setCallStatus("Connection interrupted");
      }
    };

    return connection;
  }

  async function handleIncomingSignal(signal: CallSignalPayload) {
    if (!threadId) return;
    if (signal.fromUserId === currentUser.id) return;
    if (signal.toUserId && signal.toUserId !== currentUser.id) return;

    try {
      if (signal.type === "offer") {
        const payload = signal.payload as { sdp: RTCSessionDescriptionInit };
        const connection = await ensurePeerConnection(threadId, signal.callId, signal.fromUserId);
        await connection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        await postSignal(threadId, signal.callId, "answer", { sdp: connection.localDescription?.toJSON() });
        setCallStatus("Negotiating media");
        return;
      }

      if (signal.type === "answer") {
        const payload = signal.payload as { sdp: RTCSessionDescriptionInit };
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        setCallStatus("Negotiating media");
        return;
      }

      if (signal.type === "ice-candidate") {
        const payload = signal.payload as { candidate: RTCIceCandidateInit };
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    } catch {
      setError("Failed to negotiate call media.");
    }
  }

  async function maybeInitiateOffer(currentCall: ActiveCall) {
    if (!threadId || peerConnectionRef.current) return;

    const localInCall = currentCall.participants.some(
      (participant) => participant.userId === currentUser.id && !participant.leftAt
    );
    if (!localInCall) return;
    if (currentCall.startedById !== currentUser.id) return;

    const other = currentCall.participants.find(
      (participant) => participant.userId !== currentUser.id && !participant.leftAt
    );
    if (!other) return;

    const connection = await ensurePeerConnection(threadId, currentCall.id, other.userId);
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    await postSignal(threadId, currentCall.id, "offer", { sdp: connection.localDescription?.toJSON() }, other.userId);
    setCallStatus("Calling...");
  }

  useEffect(() => {
    cleanupRtc(true);
    stopCallRecording();
    stopLiveTranscription();
    transcriptionSessionIdRef.current = null;
    setInviteUserId("");
    setLiveTranscript("");
    setTranscriptFilePath("");
    setMeetingReportPath("");
    setCallInfo(null);
    setCallStatus("Idle");

    if (threadId) void loadCall(threadId);
  }, [threadId]);

  useEffect(() => {
    return () => {
      stopCallRecording();
      stopLiveTranscription();
      cleanupRtc(true);
    };
  }, []);

  useEffect(() => {
    if (!threadId) return;

    const source = new EventSource(`/api/threads/${threadId}/stream`);

    const onMessageCreated = () => {
      void Promise.all([loadMessages(threadId, ""), loadLinks(threadId), loadThreads()]);
    };

    const onCallEvent = () => {
      void loadCall(threadId);
    };

    const onCallEnded = () => {
      // Close recipient-side call notifications immediately when caller ends.
      stopCallRecording();
      stopLiveTranscription();
      setIsIncomingCallPromptOpen(false);
      setIsCallPopupOpen(false);
      setCallStatus("Call ended");
      void loadCall(threadId);
    };

    const onCallSignal = (event: Event) => {
      try {
        const raw = event as MessageEvent<string>;
        const payload = JSON.parse(raw.data) as CallSignalPayload;
        void handleIncomingSignal(payload);
      } catch {
        setError("Realtime call signaling decode failed.");
      }
    };
    const onCallTranscript = (event: Event) => {
      try {
        const raw = event as MessageEvent<string>;
        const payload = JSON.parse(raw.data) as {
          byUserId?: string;
          lines?: string[];
          filePath?: string;
          reportFilePath?: string;
        };

        if (payload.byUserId === currentUser.id) return;
        if (Array.isArray(payload.lines) && payload.lines.length > 0) {
          appendLiveTranscriptLines(payload.lines.filter((line) => typeof line === "string" && line.trim().length > 0));
        }
        if (typeof payload.filePath === "string" && payload.filePath) {
          setTranscriptFilePath(payload.filePath);
        }
        if (typeof payload.reportFilePath === "string" && payload.reportFilePath) {
          setMeetingReportPath(payload.reportFilePath);
        }
      } catch {
        setError("Realtime transcript update decode failed.");
      }
    };

    source.addEventListener("message.created", onMessageCreated);
    source.addEventListener("call.started", onCallEvent);
    source.addEventListener("call.ended", onCallEnded);
    source.addEventListener("call.participant_left", onCallEvent);
    source.addEventListener("call.participant_joined", onCallEvent);
    source.addEventListener("call.recording_started", onCallEvent);
    source.addEventListener("call.recording_stopped", onCallEvent);
    source.addEventListener("call.invited", onCallEvent);
    source.addEventListener("call.signal", onCallSignal);
    source.addEventListener("call.transcript", onCallTranscript);

    source.onerror = () => setError("Realtime connection interrupted. Reconnecting...");
    source.onopen = () => setError("");

    return () => {
      source.removeEventListener("message.created", onMessageCreated);
      source.removeEventListener("call.started", onCallEvent);
      source.removeEventListener("call.ended", onCallEnded);
      source.removeEventListener("call.participant_left", onCallEvent);
      source.removeEventListener("call.participant_joined", onCallEvent);
      source.removeEventListener("call.recording_started", onCallEvent);
      source.removeEventListener("call.recording_stopped", onCallEvent);
      source.removeEventListener("call.invited", onCallEvent);
      source.removeEventListener("call.signal", onCallSignal);
      source.removeEventListener("call.transcript", onCallTranscript);
      source.close();
    };
  }, [currentUser.id, threadId]);

  useEffect(() => {
    if (!callInfo) return;
    void maybeInitiateOffer(callInfo);
  }, [callInfo]);

  const activeThread = useMemo(() => threads.find((t) => t.id === threadId), [threads, threadId]);
  const groupThreads = useMemo(
    () =>
      threads.filter(
        (t) =>
          !t.isDirect &&
          (!sidebarSearch.trim() ||
            t.title.toLowerCase().includes(sidebarSearch.trim().toLowerCase()))
      ),
    [threads, sidebarSearch]
  );
  const visibleUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          !sidebarSearch.trim() ||
          `${u.name} ${u.email}`.toLowerCase().includes(sidebarSearch.trim().toLowerCase())
      ),
    [users, sidebarSearch]
  );

  const activeDirectPeerId = useMemo(() => {
    if (!activeThread || !activeThread.isDirect) return null;
    const peer = activeThread.members.find((member) => member.id !== currentUser.id);
    return peer?.id ?? null;
  }, [activeThread, currentUser.id]);

  const canCall = Boolean(threadId && (activeThread?.members?.length ?? 0) >= 2);
  const isGroupOwner = Boolean(
    activeThread &&
      !activeThread.isDirect &&
      activeThread.members.some((member) => member.id === currentUser.id && member.role === "OWNER")
  );
  const userIsInCall = Boolean(
    callInfo?.participants.some((participant) => participant.userId === currentUser.id && !participant.leftAt)
  );
  const incomingCallerName = useMemo(() => {
    if (!callInfo || !activeThread) return "Unknown caller";
    const caller = activeThread.members.find((member) => member.id === callInfo.startedById);
    return caller?.name || caller?.email || "Unknown caller";
  }, [callInfo, activeThread]);
  const callRecordingOwnerName = useMemo(() => {
    if (!callInfo?.isRecording || !activeThread || !callInfo.recordingStartedById) return "";
    const owner = activeThread.members.find((member) => member.id === callInfo.recordingStartedById);
    return owner?.name || owner?.email || "A participant";
  }, [activeThread, callInfo]);
  const addableCallUsers = useMemo(() => {
    if (!activeThread || !callInfo) return [] as UserDirectory[];
    const memberIds = new Set(activeThread.members.map((member) => member.id));
    const participantIds = new Set(callInfo.participants.map((participant) => participant.userId));
    return users.filter((user) => !memberIds.has(user.id) && !participantIds.has(user.id));
  }, [activeThread, callInfo, users]);
  const sharedRecordingActive = Boolean(callInfo?.isRecording);
  const localSpeakerName = useMemo(
    () => currentUser.name?.trim() || currentUser.email?.trim() || "Unknown speaker",
    [currentUser.email, currentUser.name]
  );
  const remoteSpeakerName = useMemo(() => {
    if (!activeThread?.isDirect) return "Unknown speaker";
    const peer = activeThread.members.find((member) => member.id !== currentUser.id);
    return peer?.name?.trim() || peer?.email?.trim() || "Unknown speaker";
  }, [activeThread, currentUser.id]);

  useEffect(() => {
    if (!callInfo) {
      stopCallRecording();
      stopLiveTranscription();
      transcriptionSessionIdRef.current = null;
      setIsCallPopupOpen(false);
    }
  }, [callInfo]);

  useEffect(() => {
    if (userIsInCall) {
      void startLiveTranscription();
      return;
    }
    stopLiveTranscription();
  }, [userIsInCall, threadId]);

  useEffect(() => {
    if (!callInfo) {
      setIsIncomingCallPromptOpen(false);
      setDismissedIncomingCallId(null);
      return;
    }

    const isIncomingForCurrentUser =
      canCall &&
      callInfo.startedById !== currentUser.id &&
      !userIsInCall &&
      !isCallPopupOpen &&
      dismissedIncomingCallId !== callInfo.id;

    if (isIncomingForCurrentUser) {
      setIsIncomingCallPromptOpen(true);
      setCallStatus("Incoming call");
      return;
    }

    if (userIsInCall || callInfo.startedById === currentUser.id) {
      setIsIncomingCallPromptOpen(false);
    }
  }, [callInfo, canCall, currentUser.id, dismissedIncomingCallId, isCallPopupOpen, userIsInCall]);

  async function postCallAction(
    action: "start" | "join" | "leave" | "end" | "recording_start" | "recording_stop" | "invite",
    options?: { targetUserId?: string }
  ): Promise<boolean> {
    if (!threadId) return false;
    setCallBusy(true);
    setError("");

    const response = await fetch(`/api/threads/${threadId}/call`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, targetUserId: options?.targetUserId })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setCallBusy(false);
      setError(payload.error || "Call action failed.");
      return false;
    }

    setCallInfo(payload.call ?? null);
    callIdRef.current = payload.call?.id ?? null;

    if (action === "start" || action === "join") {
      try {
        await ensureLocalMedia();
        void startLiveTranscription();
        setCallStatus(action === "start" ? "Waiting for participant" : "Joined call");
      } catch {
        setError("Could not access camera/microphone.");
      }
    }

    if (action === "leave" || action === "end") {
      stopCallRecording();
      stopLiveTranscription();
      cleanupRtc(true);
      setCallStatus(action === "end" ? "Call ended" : "Left call");
      setIsCallPopupOpen(false);
    }

    if (action === "invite") {
      setInviteUserId("");
      setCallStatus("User invited to call");
    }

    setCallBusy(false);
    return true;
  }

  async function onStartAudioCall() {
    if (callInfo && userIsInCall) {
      setIsCallPopupOpen(true);
      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getVideoTracks()) {
          track.enabled = false;
        }
      }
      setIsCamEnabled(false);
      return;
    }

    const ok = await postCallAction(callInfo ? "join" : "start");
    if (!ok) return;
    if (!localStreamRef.current) return;
    for (const track of localStreamRef.current.getVideoTracks()) {
      track.enabled = false;
    }
    setIsCamEnabled(false);
    setIsCallPopupOpen(true);
  }

  async function onStartVideoCall() {
    if (callInfo && userIsInCall) {
      setIsCallPopupOpen(true);
      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getVideoTracks()) {
          track.enabled = true;
        }
      }
      setIsCamEnabled(true);
      return;
    }

    const ok = await postCallAction(callInfo ? "join" : "start");
    if (!ok) return;
    if (!localStreamRef.current) return;
    for (const track of localStreamRef.current.getVideoTracks()) {
      track.enabled = true;
    }
    setIsCamEnabled(true);
    setIsCallPopupOpen(true);
  }

  async function onAcceptIncomingCall(mode: "audio" | "video") {
    setIsIncomingCallPromptOpen(false);
    if (mode === "video") {
      await onStartVideoCall();
      return;
    }
    await onStartAudioCall();
  }

  function onDeclineIncomingCall() {
    if (callInfo?.id) {
      setDismissedIncomingCallId(callInfo.id);
    }
    setIsIncomingCallPromptOpen(false);
    setCallStatus("Incoming call dismissed");
  }

  async function onCloseCallWindow() {
    if (callInfo && userIsInCall) {
      await postCallAction("end");
      return;
    }
    setIsCallPopupOpen(false);
  }

  async function onOpenDirectChat(targetUserId: string) {
    setError("");

    const existing = threads.find(
      (thread) =>
        thread.isDirect && thread.members.length === 2 && thread.members.some((member) => member.id === targetUserId)
    );

    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    const response = await fetch("/api/threads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetUserId })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Failed to open direct chat.");
      return;
    }

    await loadThreads();
    router.push(`/chat/${payload.threadId}`);
  }

  async function onSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!threadId || !draft.trim()) return;

    const response = await fetch(`/api/threads/${threadId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: draft })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Failed to send message.");
      return;
    }

    setDraft("");
    await Promise.all([loadMessages(threadId, ""), loadLinks(threadId), loadThreads()]);
  }

  async function onCreateGroupChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (groupName.trim().length < 2) {
      setError("Group name must be at least 2 characters.");
      return;
    }

    if (groupMemberIds.length < 2) {
      setError("Select at least 2 members to create a group.");
      return;
    }

    setCreatingGroup(true);

    const response = await fetch("/api/threads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: groupName.trim(),
        memberUserIds: groupMemberIds
      })
    });

    const payload = await response.json().catch(() => ({}));
    setCreatingGroup(false);

    if (!response.ok) {
      setError(payload.error || "Failed to create group chat.");
      return;
    }

    setIsGroupModalOpen(false);
    setGroupName("");
    setGroupMemberIds([]);
    await loadThreads();
    router.push(`/chat/${payload.threadId}`);
  }

  function toggleGroupMember(userId: string) {
    setGroupMemberIds((existing) =>
      existing.includes(userId)
        ? existing.filter((id) => id !== userId)
        : [...existing, userId]
    );
  }

  useEffect(() => {
    if (activeThread && !activeThread.isDirect) {
      setGroupEditName(activeThread.title || "");
    } else {
      setGroupEditName("");
    }
  }, [activeThread]);

  async function onRenameGroupChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!threadId || !isGroupOwner) return;
    if (groupEditName.trim().length < 2) {
      setError("Group name must be at least 2 characters.");
      return;
    }

    setGroupActionBusy(true);
    setError("");
    const response = await fetch(`/api/threads/${threadId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "rename", title: groupEditName.trim() })
    });
    const payload = await response.json().catch(() => ({}));
    setGroupActionBusy(false);

    if (!response.ok) {
      setError(payload.error || "Failed to rename group.");
      return;
    }

    await loadThreads();
  }

  async function onArchiveGroupChat() {
    if (!threadId || !isGroupOwner) return;

    setGroupActionBusy(true);
    setError("");
    const response = await fetch(`/api/threads/${threadId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "archive" })
    });
    const payload = await response.json().catch(() => ({}));
    setGroupActionBusy(false);

    if (!response.ok) {
      setError(payload.error || "Failed to archive group.");
      return;
    }

    setIsGroupManageModalOpen(false);
    await loadThreads();
    router.push("/chat");
  }

  async function onPromoteCoAdmin(targetUserId: string) {
    if (!threadId || !isGroupOwner) return;
    setGroupActionBusy(true);
    setError("");

    const response = await fetch(`/api/threads/${threadId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "promote", targetUserId })
    });
    const payload = await response.json().catch(() => ({}));
    setGroupActionBusy(false);

    if (!response.ok) {
      setError(payload.error || "Failed to promote member.");
      return;
    }

    await loadThreads();
  }

  function toggleTrack(kind: "audio" | "video") {
    if (!localStreamRef.current) return;
    const tracks = kind === "audio" ? localStreamRef.current.getAudioTracks() : localStreamRef.current.getVideoTracks();
    for (const track of tracks) {
      track.enabled = !track.enabled;
    }

    if (kind === "audio") setIsMicEnabled((value) => !value);
    if (kind === "video") setIsCamEnabled((value) => !value);
  }

  function initials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  async function onLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  function parseSearchInput(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return { context: "", query: "" };
    if (!trimmed.startsWith("@")) return { context: "", query: trimmed };

    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1) {
      return { context: trimmed.slice(1), query: "" };
    }

    return {
      context: trimmed.slice(1, firstSpace).trim(),
      query: trimmed.slice(firstSpace + 1).trim()
    };
  }

  useEffect(() => {
    const { context, query } = parseSearchInput(searchInput);
    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      const params = new URLSearchParams({ q: query });
      if (context) params.set("context", context);

      const response = await fetch(`/api/search/messages?${params.toString()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        setSearchLoading(false);
        return;
      }

      const payload = await response.json().catch(() => ({ results: [] }));
      setSearchResults(payload.results ?? []);
      setSearchLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="chat-shell">
      <div className="container top-toolbar">
        <div className="top-search-wrap">
          <input
            className="input"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all messages or @user/@group query"
            value={searchInput}
          />
        </div>
        <IconButton disabled={loggingOut} onClick={() => void onLogout()} title="Logout">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </IconButton>
      </div>
      <div className="container chat-layout">
        <aside className="panel sidebar modern-left-pane">
          <div className="sidebar-head">
            <div className="brand-row">
              <div className="brand-badge">C</div>
              <div>
                <div className="thread-title">Connect Hub</div>
                <div className="thread-meta">{currentUser.name}</div>
              </div>
            </div>
            {currentUser.role === "ADMIN" ? (
              <div className="top-actions">
                <Link className="tab" href="/admin/invitations">
                  Invitations
                </Link>
                <Link className="tab" href="/admin/meetings">
                  Meetings
                </Link>
              </div>
            ) : null}
            <input
              className="input"
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search people or groups"
              value={sidebarSearch}
            />
          </div>

          <div className="left-section">
            <div className="left-section-title">Users</div>
            <div className="left-chips">
              {visibleUsers.map((user) => (
                <button
                  className={`online-chip ${activeDirectPeerId === user.id ? "active" : ""} ${user.online ? "" : "offline"}`}
                  key={user.id}
                  onClick={() => void onOpenDirectChat(user.id)}
                  type="button"
                >
                  <span className="avatar-dot">{initials(user.name || user.email)}</span>
                  <span className="online-chip-name">{user.name}</span>
                  <span className={`presence-dot ${user.online ? "" : "offline"}`} />
                </button>
              ))}
              {visibleUsers.length === 0 ? <div className="thread-meta">No users found</div> : null}
            </div>
          </div>

          <div className="left-section">
            <div className="left-section-head">
              <div className="left-section-title">Group Chats</div>
              <button className="tab mini-tab" onClick={() => setIsGroupModalOpen(true)} type="button">
                New
              </button>
            </div>
            <div className="left-list">
              {groupThreads.map((thread) => (
                <button
                  className={`group-card ${threadId === thread.id ? "active" : ""}`}
                  key={thread.id}
                  onClick={() => router.push(`/chat/${thread.id}`)}
                  type="button"
                >
                  <span className="group-hash">#</span>
                  <span className="group-name">{thread.title}</span>
                  <span className="group-members">{thread.members.length}</span>
                </button>
              ))}
              {groupThreads.length === 0 ? <div className="thread-meta">No group chats yet</div> : null}
            </div>
          </div>
        </aside>

        <section className="panel main modern-chat-pane">
          <div className="main-head">
            <div>
              <div className="thread-title">{activeThread?.title || "Select a user or group"}</div>
              <div className="thread-meta">
                {activeThread
                  ? activeThread.isDirect
                    ? "Direct conversation"
                    : `Group chat · ${activeThread.members.length} members`
                  : "Choose an online user or a group from the left pane."}
              </div>
            </div>

            {canCall ? (
              <div className="chat-head-actions">
                <IconButton disabled={callBusy} onClick={() => void onStartAudioCall()} title="Audio call">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.6a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.27-1.27a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.6.62A2 2 0 0 1 22 16.92z" />
                  </svg>
                </IconButton>
                <IconButton disabled={callBusy} onClick={() => void onStartVideoCall()} title="Video call">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                    <path d="M16 10l6-3v10l-6-3z" />
                  </svg>
                </IconButton>
                {callInfo && userIsInCall ? (
                  <IconButton onClick={() => setIsCallPopupOpen(true)} title="Open call window">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M7 9h10M7 13h10M7 17h6" />
                    </svg>
                  </IconButton>
                ) : null}
              </div>
            ) : null}
            {isGroupOwner ? (
              <button className="tab" onClick={() => setIsGroupManageModalOpen(true)} type="button">
                Manage Group
              </button>
            ) : null}
          </div>

          <div className="tabs">
            <button
              className={`tab ${tab === "messages" ? "active" : ""}`}
              onClick={() => setTab("messages")}
              type="button"
            >
              Messages
            </button>
            <button
              className={`tab ${tab === "links" ? "active" : ""}`}
              onClick={() => setTab("links")}
              type="button"
            >
              Shared Links
            </button>
          </div>

          <div className="search-row">
            
            {error ? <div className="error">{error}</div> : null}
          </div>

          <div className="feed">
            {!threadId ? <div className="thread-meta">No chat selected.</div> : null}
            {searchInput.trim()
              ? searchLoading
                ? <div className="thread-meta">Searching messages...</div>
                : (
                    <div className="links-list">
                      {searchResults.map((result) => (
                        <button
                          className="link-row"
                          key={result.id}
                          onClick={() => router.push(`/chat/${result.threadId}`)}
                          type="button"
                        >
                          <div className="thread-title">{result.threadTitle}</div>
                          <div className="thread-meta">{result.sender.name}</div>
                          <div className="message-body">{result.body}</div>
                          <div className="thread-meta">{new Date(result.createdAt).toLocaleString()}</div>
                        </button>
                      ))}
                      {searchResults.length === 0 ? (
                        <div className="thread-meta">No matching messages found.</div>
                      ) : null}
                    </div>
                  )
              : threadId && tab === "messages"
              ? messages.map((message) => (
                  <article className="message" key={message.id}>
                    <div className="message-author">{message.sender.name}</div>
                    <div className="message-body">{message.body}</div>
                    <div className="message-time">{new Date(message.createdAt).toLocaleString()}</div>
                  </article>
                ))
              : null}

            {threadId && tab === "links" ? (
              <div className="links-list">
                {links.map((link) => (
                  <div className="link-row" key={link.id}>
                    <a className="link-url" href={link.url} rel="noreferrer" target="_blank">
                      {link.url}
                    </a>
                    <div className="thread-meta">Shared by {link.message.sender.name}</div>
                    <div className="thread-meta">{new Date(link.createdAt).toLocaleString()}</div>
                  </div>
                ))}
                {links.length === 0 ? <div className="thread-meta">No links shared yet.</div> : null}
              </div>
            ) : null}
          </div>

          <form className="composer" onSubmit={onSendMessage}>
            <textarea
              className="textarea"
              disabled={!threadId}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={threadId ? "Type message" : "Select a chat first"}
              value={draft}
            />
            <button className="button" disabled={!threadId} type="submit">
              Send
            </button>
          </form>
        </section>
      </div>

      {isCallPopupOpen && canCall ? (
        <div className="call-modal-backdrop">
          <section className="call-modal">
            <div className="call-modal-head">
              <div>
                <div className="thread-title">Call Window</div>
                <div className="thread-meta">{callInfo ? callStatus : "No active call"}</div>
                {sharedRecordingActive ? (
                  <div className="thread-meta">Recording in progress{callRecordingOwnerName ? ` · ${callRecordingOwnerName}` : ""}</div>
                ) : null}
              </div>
              <button className="tab" disabled={callBusy} onClick={() => void onCloseCallWindow()} type="button">
                Close
              </button>
            </div>

            <div className="video-grid">
              <div className="video-card">
                <div className="thread-meta">You</div>
                <video autoPlay className="video" muted playsInline ref={localVideoRef} />
              </div>
              <div className="video-card">
                <div className="thread-meta">Attendee</div>
                <video autoPlay className="video" playsInline ref={remoteVideoRef} />
              </div>
            </div>

            <div className="call-modal-controls">
              <button className="tab" onClick={() => toggleTrack("audio")} type="button">
                {isMicEnabled ? "Mute" : "Unmute"}
              </button>
              <button className="tab" onClick={() => toggleTrack("video")} type="button">
                {isCamEnabled ? "Camera Off" : "Camera On"}
              </button>
              <button
                className="tab"
                disabled={!userIsInCall || recordingBusy || (sharedRecordingActive && !isRecording)}
                onClick={() => (isRecording ? stopCallRecording() : void startCallRecording())}
                type="button"
              >
                {recordingBusy
                  ? "Saving..."
                  : isRecording
                  ? "Stop Recording"
                  : sharedRecordingActive
                  ? "Recording Active"
                  : "Start Recording"}
              </button>
              <select
                className="input"
                disabled={!userIsInCall || addableCallUsers.length === 0 || callBusy}
                onChange={(event) => setInviteUserId(event.target.value)}
                value={inviteUserId}
              >
                <option value="">Add user to call</option>
                {addableCallUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                className="tab"
                disabled={!userIsInCall || !inviteUserId || callBusy}
                onClick={() => void postCallAction("invite", { targetUserId: inviteUserId })}
                type="button"
              >
                Add
              </button>
              <button className="tab" onClick={() => void postCallAction("leave")} type="button">
                Leave
              </button>
              <button className="tab" onClick={() => void postCallAction("end")} type="button">
                End
              </button>
            </div>

            <div className="call-transcript-panel">
              <div className="thread-title">Live Transcript</div>
              <div className="thread-meta">
                {isLiveTranscribing ? "Listening..." : "Paused"}
                {transcriptFilePath ? ` · Buffering to ${transcriptFilePath}` : ""}
                {meetingReportPath ? ` · Report ${meetingReportPath}` : ""}
              </div>
              <pre className="call-transcript-text">{liveTranscript || "Transcript will appear here during the call."}</pre>
            </div>
          </section>
        </div>
      ) : null}

      {isIncomingCallPromptOpen && canCall ? (
        <div className="call-modal-backdrop">
          <section className="call-modal">
            <div className="call-modal-head">
              <div>
                <div className="thread-title">Incoming Call</div>
                <div className="thread-meta">{incomingCallerName} is calling you.</div>
              </div>
            </div>
            <div className="call-modal-controls">
              <button className="tab" disabled={callBusy} onClick={() => void onAcceptIncomingCall("audio")} type="button">
                Accept Audio
              </button>
              <button className="tab" disabled={callBusy} onClick={() => void onAcceptIncomingCall("video")} type="button">
                Accept Video
              </button>
              <button className="tab danger-tab" disabled={callBusy} onClick={onDeclineIncomingCall} type="button">
                Decline
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isGroupModalOpen ? (
        <div className="call-modal-backdrop">
          <section className="call-modal">
            <div className="call-modal-head">
              <div>
                <div className="thread-title">Create Group Chat</div>
                <div className="thread-meta">Name your group and add users.</div>
              </div>
              <button className="tab" onClick={() => setIsGroupModalOpen(false)} type="button">
                Close
              </button>
            </div>

            <form className="form-grid" onSubmit={onCreateGroupChat}>
              <input
                className="input"
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name"
                value={groupName}
              />
              <div className="group-member-grid">
                {users.map((user) => (
                  <label className="group-member-item" key={user.id}>
                    <input
                      checked={groupMemberIds.includes(user.id)}
                      onChange={() => toggleGroupMember(user.id)}
                      type="checkbox"
                    />
                    <span>{user.name}</span>
                    <span className={`thread-meta ${user.online ? "online-text" : ""}`}>
                      {user.online ? "Online" : "Offline"}
                    </span>
                  </label>
                ))}
              </div>
              <button className="button" disabled={creatingGroup} type="submit">
                {creatingGroup ? "Creating..." : "Create Group Chat"}
              </button>
            </form>
          </section>
        </div>
      ) : null}

      {isGroupManageModalOpen && activeThread && !activeThread.isDirect ? (
        <div className="call-modal-backdrop">
          <section className="call-modal">
            <div className="call-modal-head">
              <div>
                <div className="thread-title">Manage Group</div>
                <div className="thread-meta">Owner controls: rename, archive, co-admins.</div>
              </div>
              <button className="tab" onClick={() => setIsGroupManageModalOpen(false)} type="button">
                Close
              </button>
            </div>

            <form className="form-grid" onSubmit={onRenameGroupChat}>
              <input
                className="input"
                onChange={(e) => setGroupEditName(e.target.value)}
                placeholder="Group name"
                value={groupEditName}
              />
              <button className="button" disabled={groupActionBusy} type="submit">
                Rename Group
              </button>
            </form>

            <div className="group-member-grid">
              {activeThread.members.map((member) => (
                <div className="group-member-item" key={member.id}>
                  <span>{member.name}</span>
                  <span className="thread-meta">{member.role}</span>
                  {member.role !== "OWNER" ? (
                    <button
                      className="tab mini-tab"
                      disabled={groupActionBusy || member.role === "ADMIN"}
                      onClick={() => void onPromoteCoAdmin(member.id)}
                      type="button"
                    >
                      {member.role === "ADMIN" ? "Co-admin" : "Make Co-admin"}
                    </button>
                  ) : (
                    <span className="tab mini-tab">Owner</span>
                  )}
                </div>
              ))}
            </div>

            <button className="tab danger-tab" disabled={groupActionBusy} onClick={() => void onArchiveGroupChat()} type="button">
              Archive Group
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
