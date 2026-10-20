import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="flex-1 px-4 pb-8 pt-6">
      <h1 className="mb-6 text-[24px] font-bold tracking-tight">Log in</h1>
      <AuthForm mode="login" />
    </main>
  );
}
