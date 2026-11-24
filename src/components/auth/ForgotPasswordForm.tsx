"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const r = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message || "Request failed");
        return;
      }
      setMessage(d.message);
    } catch {
      setError("Cannot connect to server");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-slate-600">
        Enter your email address. If an account exists, we will send a password
        reset link.
      </p>
      <input
        className="auth-input"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {message && (
        <p role="status" className="text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button className="auth-button" disabled={busy}>
        {busy ? "Sending..." : "Send reset link"}
      </button>
      <p className="text-center text-sm">
        <Link className="text-blue-700" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
