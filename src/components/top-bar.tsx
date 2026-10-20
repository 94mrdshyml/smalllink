import Link from "next/link";
import { getSession } from "@/lib/session";
import { Mark } from "./mark";
import { SignOutButton } from "./sign-out-button";

export async function TopBar() {
  const session = await getSession();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4">
      <Link
        href={session ? "/dashboard" : "/"}
        className="flex h-11 items-center gap-2 text-[15px] font-medium"
      >
        <Mark />
        smalllink
      </Link>
      {session ? (
        <SignOutButton />
      ) : (
        <Link href="/login" className="flex h-11 items-center text-muted">
          Log in
        </Link>
      )}
    </header>
  );
}
