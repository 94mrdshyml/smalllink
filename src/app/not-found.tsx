import Link from "next/link";
import { secondaryBtn } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col justify-center px-4 pb-24">
      <h1 className="text-[24px] font-bold tracking-tight">No link here</h1>
      <p className="mt-2 text-muted">
        This address isn&rsquo;t a smalllink, or its owner deleted it.
      </p>
      <Link href="/" className={`${secondaryBtn} mt-6 w-fit`}>
        Go to smalllink
      </Link>
    </main>
  );
}
