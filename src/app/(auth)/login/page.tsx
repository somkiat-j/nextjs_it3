import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <main className="min-h-screen p-5">
      <section className="auth-card">
        <h1 className="mb-2 text-center text-3xl font-bold">Welcome back</h1>
        <p className="mb-7 text-center text-sm text-slate-500">
          Sign in to your account
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
