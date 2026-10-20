import Link from "next/link";
import { redirect } from "next/navigation";
import { currentHost } from "@/lib/host";
import { getSession } from "@/lib/session";
import { primaryBtn, secondaryBtn } from "@/components/ui";

export default async function Home() {
  if (await getSession()) redirect("/dashboard");
  const host = await currentHost();

  return (
    <main className="flex flex-1 flex-col justify-between px-4 pb-8 pt-8">
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight">
          Short links.
          <br />
          Real counts.
        </h1>
        <p className="mt-3 max-w-[32ch] text-[16px] text-muted">
          Pick your own slug, share the link, and see who clicked it and where they came from.
        </p>

        <dl className="mt-8 divide-y divide-rule rounded-lg border border-border bg-surface">
          <div className="px-4 py-3">
            <dt className="text-[13px] text-muted">Your slug</dt>
            <dd className="font-mono text-[15px]">{host}/summer-sale</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-[13px] text-muted">Every click counted</dt>
            <dd>By day, with the page it came from</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-[13px] text-muted">Also shown</dt>
            <dd>Country, device and browser</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <Link href="/signup" className={primaryBtn}>
          Create account
        </Link>
        <Link href="/login" className={secondaryBtn}>
          Log in
        </Link>
      </div>
    </main>
  );
}
