"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Field, inputCls, primaryBtn } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const signup = mode === "signup";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const res = signup
      ? await authClient.signUp.email({ name: String(form.get("name")), email, password })
      : await authClient.signIn.email({ email, password });

    if (res.error) {
      setError(res.error.message ?? "Something went wrong. Try again.");
      setPending(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {signup && (
        <Field label="Name">
          <input name="name" required autoComplete="name" className={inputCls} />
        </Field>
      )}
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </Field>
      <Field label="Password" hint={signup ? "At least 8 characters." : undefined}>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={signup ? "new-password" : "current-password"}
          className={inputCls}
        />
      </Field>

      {error && (
        <p role="alert" className="text-[13px] text-negative">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
        {pending ? "One moment…" : signup ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-muted">
        {signup ? "Already have an account? " : "New here? "}
        <Link href={signup ? "/login" : "/signup"} className="text-ink underline underline-offset-2">
          {signup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
