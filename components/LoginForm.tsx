"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoading(false);
      setError(payload.error || "Failed to login.");
      return;
    }

    router.replace("/chat");
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
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
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="thread-meta">
        Invitation-only workspace. Need an invite? Ask your admin.
      </div>
      <div className="thread-meta">
        No account yet? <Link href="/signup">Sign up with invite</Link>
      </div>
    </form>
  );
}
