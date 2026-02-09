type RecordingState = {
  isRecording: boolean;
  startedById: string | null;
  startedAt: Date | null;
};

type RecordingStateStore = Map<string, RecordingState>;

const globalForRecordingState = globalThis as unknown as {
  callRecordingState?: RecordingStateStore;
};

const store: RecordingStateStore = globalForRecordingState.callRecordingState ?? new Map();
if (!globalForRecordingState.callRecordingState) {
  globalForRecordingState.callRecordingState = store;
}

export function getCallRecordingState(callId: string): RecordingState {
  return (
    store.get(callId) ?? {
      isRecording: false,
      startedById: null,
      startedAt: null
    }
  );
}

export function setCallRecordingState(
  callId: string,
  input: { isRecording: boolean; startedById?: string | null; startedAt?: Date | null }
) {
  if (!input.isRecording) {
    store.set(callId, { isRecording: false, startedById: null, startedAt: null });
    return;
  }

  store.set(callId, {
    isRecording: true,
    startedById: input.startedById ?? null,
    startedAt: input.startedAt ?? new Date()
  });
}

export function clearCallRecordingState(callId: string) {
  store.delete(callId);
}

