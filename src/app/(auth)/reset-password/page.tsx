import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen p-5">
      <section className="auth-card">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Set a new password
        </h1>
        <p className="mb-7 text-center text-sm text-slate-500">
          Choose a strong password
        </p>
        <Suspense fallback={<p>Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
