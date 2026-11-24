import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/auth/LogoutButton";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <main className="min-h-screen p-6">
      <section className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="mt-6">
          Welcome, <strong>{user.name}</strong>
        </p>
        <p className="mt-2 text-slate-600">Email: {user.email}</p>
        <p className="mt-2 text-slate-600">Role: {user.role}</p>
      </section>
    </main>
  );
}
