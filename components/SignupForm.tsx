"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = useMemo(() => searchParams.get("code") ?? "", [searchParams]);
  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState(initialCode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password,
        invitationCode
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoading(false);
      setError(payload.error || "Failed to sign up.");
      return;
    }

    router.replace("/chat");
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        required
      />
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Allowed email"
        required
      />
      <input
        className="input"
        type="text"
        value={invitationCode}
        onChange={(e) => setInvitationCode(e.target.value)}
        placeholder="Invitation code"
        required
      />
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error ? <div className="error">{error}</div> : null}
      <button className="button" disabled={loading} type="submit">
        {loading ? "Creating account..." : "Create account"}
      </button>
      <div className="thread-meta">
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </form>
  );
}
