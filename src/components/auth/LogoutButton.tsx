"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const r = await fetch("/api/auth/logout", { method: "POST" });
    if (r.ok) {
      router.replace("/login");
      router.refresh();
    }
  }
  return (
    <button
      onClick={logout}
      className="rounded-lg bg-red-600 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}
