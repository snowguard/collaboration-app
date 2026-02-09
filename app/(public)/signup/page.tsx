import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Your email and invitation code must match.</p>
        <SignupForm />
      </section>
    </main>
  );
}
