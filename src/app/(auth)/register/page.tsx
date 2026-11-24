import RegisterForm from "@/components/auth/RegisterForm";
export default function RegisterPage() {
  return (
    <main className="min-h-screen p-5">
      <section className="auth-card">
        <h1 className="mb-2 text-center text-3xl font-bold">Create account</h1>
        <p className="mb-7 text-center text-sm text-slate-500">
          Register a new account
        </p>
        <RegisterForm />
      </section>
    </main>
  );
}
