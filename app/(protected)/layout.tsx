import { requireUser } from "@/lib/auth";
import { IncomingCallNotifier } from "@/components/IncomingCallNotifier";
import { ensureMeetingQueueWorkerStarted } from "@/lib/meeting-queue";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  ensureMeetingQueueWorkerStarted();
  return (
    <>
      <IncomingCallNotifier />
      {children}
    </>
  );
}
