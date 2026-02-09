"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Invitation = {
  id: string;
  code: string;
  email: string;
  expiresAt: string | null;
  usedAt: string | null;
  createdAt: string;
  usedBy: { name: string; email: string } | null;
};

export function InvitationsAdmin() {
  const [email, setEmail] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(14);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  async function loadInvitations() {
    const response = await fetch("/api/invitations", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setInvitations(payload.invitations ?? []);
  }

  useEffect(() => {
    void loadInvitations();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, expiresInDays })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Failed to create invitation.");
      return;
    }

    const absoluteUrl = `${window.location.origin}${payload.signupUrl}`;
    setSuccess(`Invite created. Share this URL: ${absoluteUrl}`);
    setEmail("");
    setExpiresInDays(14);
    await loadInvitations();
  }

  return (
    <div className="chat-shell">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <div className="panel" style={{ padding: "1rem" }}>
          <div className="top-actions" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>Invitation Management</h2>
            <Link className="tab" href="/chat">
              Back to chat
            </Link>
          </div>
          <p className="thread-meta">Only admins can issue invitation links mapped to allowed emails.</p>

          <form className="form-grid" onSubmit={onCreate}>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="invitee@company.com"
              type="email"
              required
            />
            <input
              className="input"
              min={1}
              max={90}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              type="number"
              required
            />
            <button className="button" type="submit">
              Create Invitation
            </button>
            {error ? <div className="error">{error}</div> : null}
            {success ? <div className="success">{success}</div> : null}
          </form>
        </div>

        <div className="panel" style={{ padding: "1rem", overflowX: "auto" }}>
          <h3 style={{ marginTop: 0 }}>Recent Invitations</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Email</th>
                <th align="left">Code</th>
                <th align="left">Status</th>
                <th align="left">Expires</th>
                <th align="left">Used by</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.email}</td>
                  <td style={{ fontFamily: "ui-monospace, monospace" }}>{inv.code}</td>
                  <td>{inv.usedAt ? "Used" : "Open"}</td>
                  <td>{inv.expiresAt ? new Date(inv.expiresAt).toLocaleString() : "Never"}</td>
                  <td>{inv.usedBy ? `${inv.usedBy.name} (${inv.usedBy.email})` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
