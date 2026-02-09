import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your collaboration workspace.</p>
        <LoginForm />
      </section>
    </main>
  );
}
