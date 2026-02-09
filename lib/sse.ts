type ThreadSubscriber = {
  id: string;
  userId: string;
  send: (event: string, data: unknown) => void;
  close: () => void;
};

type ThreadHub = Map<string, Map<string, ThreadSubscriber>>;
type UserHub = Map<string, Map<string, ThreadSubscriber>>;

const globalForSse = globalThis as unknown as {
  threadHub?: ThreadHub;
  userHub?: UserHub;
};

const threadHub: ThreadHub = globalForSse.threadHub ?? new Map();
const userHub: UserHub = globalForSse.userHub ?? new Map();

if (!globalForSse.threadHub) {
  globalForSse.threadHub = threadHub;
}
if (!globalForSse.userHub) {
  globalForSse.userHub = userHub;
}

function formatEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function getThreadMap(threadId: string) {
  let map = threadHub.get(threadId);
  if (!map) {
    map = new Map();
    threadHub.set(threadId, map);
  }
  return map;
}

function getUserMap(userId: string) {
  let map = userHub.get(userId);
  if (!map) {
    map = new Map();
    userHub.set(userId, map);
  }
  return map;
}

export function publishThreadEvent(threadId: string, event: string, data: unknown) {
  const subscribers = threadHub.get(threadId);
  if (!subscribers) return;

  for (const subscriber of subscribers.values()) {
    try {
      subscriber.send(event, data);
    } catch {
      subscriber.close();
      subscribers.delete(subscriber.id);
    }
  }

  if (subscribers.size === 0) {
    threadHub.delete(threadId);
  }
}

export function publishUserEvent(userId: string, event: string, data: unknown) {
  const subscribers = userHub.get(userId);
  if (!subscribers) return;

  for (const subscriber of subscribers.values()) {
    try {
      subscriber.send(event, data);
    } catch {
      subscriber.close();
      subscribers.delete(subscriber.id);
    }
  }

  if (subscribers.size === 0) {
    userHub.delete(userId);
  }
}

export function createThreadEventStream(threadId: string, userId: string) {
  const encoder = new TextEncoder();
  const subscriberId = crypto.randomUUID();
  const subscribers = getThreadMap(threadId);

  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(formatEvent(event, data)));
      };

      const close = () => {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        subscribers.delete(subscriberId);
        if (subscribers.size === 0) {
          threadHub.delete(threadId);
        }
      };

      subscribers.set(subscriberId, {
        id: subscriberId,
        userId,
        send,
        close
      });

      send("connected", { threadId, at: Date.now() });

      heartbeatTimer = setInterval(() => {
        send("heartbeat", { at: Date.now() });
      }, 25000);
    },
    cancel() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      subscribers.delete(subscriberId);
      if (subscribers.size === 0) {
        threadHub.delete(threadId);
      }
    }
  });

  return stream;
}

export function createUserEventStream(userId: string) {
  const encoder = new TextEncoder();
  const subscriberId = crypto.randomUUID();
  const subscribers = getUserMap(userId);

  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(formatEvent(event, data)));
      };

      const close = () => {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        subscribers.delete(subscriberId);
        if (subscribers.size === 0) {
          userHub.delete(userId);
        }
      };

      subscribers.set(subscriberId, {
        id: subscriberId,
        userId,
        send,
        close
      });

      send("connected", { userId, at: Date.now() });

      heartbeatTimer = setInterval(() => {
        send("heartbeat", { at: Date.now() });
      }, 25000);
    },
    cancel() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      subscribers.delete(subscriberId);
      if (subscribers.size === 0) {
        userHub.delete(userId);
      }
    }
  });

  return stream;
}
