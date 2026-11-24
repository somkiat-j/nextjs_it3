import Link from "next/link";
export default function HomePage() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <section className="text-center space-y-5">
        <h1 className="text-4xl font-bold">Next.js + MongoDB Auth</h1>
        <p className="text-slate-600">
          ตัวอย่างระบบสมาชิก Login, Register และ Session
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
            href="/login"
          >
            Login
          </Link>
          <Link className="rounded-lg border px-5 py-3" href="/register">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}
