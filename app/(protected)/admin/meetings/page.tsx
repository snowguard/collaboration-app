import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMeetingsPage() {
  await requireAdmin();

  const transcripts = await prisma.meetingTranscript.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      thread: { select: { id: true, title: true, isDirect: true } },
      call: { select: { id: true, startedAt: true, endedAt: true, status: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      note: true
    },
    take: 300
  });

  return (
    <main className="container" style={{ paddingBlock: "1rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
        <div>
          <h1 className="thread-title">Meeting Metadata</h1>
          <p className="thread-meta">Transcripts, queue-produced notes, and report artifacts.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link className="tab" href="/admin/invitations">
            Invitations
          </Link>
          <Link className="tab" href="/chat">
            Back to Chat
          </Link>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "1rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Created</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Thread</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Meeting</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Transcript</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Summary</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Action Items</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Report</th>
            </tr>
          </thead>
          <tbody>
            {transcripts.map((item) => {
              const actionItems = item.note?.actionItemsJson
                ? (JSON.parse(item.note.actionItemsJson) as string[])
                : [];
              return (
                <tr key={item.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <div className="thread-meta">{new Date(item.createdAt).toLocaleString()}</div>
                    <div className="thread-meta">By {item.createdBy.name}</div>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <div className="thread-meta">{item.thread.title || (item.thread.isDirect ? "Direct chat" : "Group chat")}</div>
                    <div className="thread-meta">Thread ID: {item.threadId}</div>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <div className="thread-meta">Session: {item.sessionId}</div>
                    <div className="thread-meta">Chunks: {item.chunkCount}</div>
                    <div className="thread-meta">Last chunk: {new Date(item.lastChunkAt).toLocaleString()}</div>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <code className="thread-meta">{item.transcriptFilePath}</code>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top", maxWidth: "28rem" }}>
                    <div className="thread-meta">{item.note?.summary || "Pending..."}</div>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    {actionItems.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                        {actionItems.slice(0, 6).map((entry, index) => (
                          <li className="thread-meta" key={`${item.id}-${index}`}>
                            {entry}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="thread-meta">Pending...</span>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    {item.reportFilePath ? (
                      <code className="thread-meta">{item.reportFilePath}</code>
                    ) : (
                      <span className="thread-meta">Pending...</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {transcripts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "0.75rem" }}>
                  <span className="thread-meta">No meeting transcripts found.</span>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
