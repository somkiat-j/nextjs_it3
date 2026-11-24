import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen p-5">
      <section className="auth-card">
        <h1 className="mb-2 text-center text-2xl font-bold">Forgot password</h1>
        <p className="mb-7 text-center text-sm text-slate-500">
          We will email you a reset link
        </p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
