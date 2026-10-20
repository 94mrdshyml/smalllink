import type { Metadata } from "next";
import { BackLink } from "@/components/ui";
import { LinkForm } from "@/components/link-form";
import { currentHost } from "@/lib/host";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "New link" };

export default async function NewLinkPage() {
  await requireUser();
  const host = await currentHost();

  return (
    <main className="flex-1 px-4 pb-8">
      <BackLink href="/dashboard">Links</BackLink>
      <h1 className="mb-6 mt-1 text-[24px] font-bold tracking-tight">New link</h1>
      <LinkForm host={host} />
    </main>
  );
}
