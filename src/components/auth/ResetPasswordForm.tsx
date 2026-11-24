"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message || "Reset failed");
        return;
      }
      router.replace("/login?reset=1");
    } catch {
      setError("Cannot connect to server");
    } finally {
      setBusy(false);
    }
  }
  if (!token)
    return (
      <p className="text-sm text-red-600">
        Reset token is missing. Please request a new link.
      </p>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm font-medium">New password</span>
        <input
          className="auth-input"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Confirm new password</span>
        <input
          className="auth-input"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button className="auth-button" disabled={busy}>
        {busy ? "Updating..." : "Reset password"}
      </button>
    </form>
  );
}
