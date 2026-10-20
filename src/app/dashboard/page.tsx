import type { Metadata } from "next";
import Link from "next/link";
import { BarChart } from "@/components/bar-chart";
import { Card, SectionHeading, primaryBtn, secondaryBtn } from "@/components/ui";
import { db } from "@/lib/db";
import { formatNumber, shortUrl } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { MAX_LINKS_PER_USER } from "@/lib/slug";
import { getOverview } from "@/lib/stats";

export const metadata: Metadata = { title: "Links" };

function Triangle({ up }: { up: boolean }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className={up ? "" : "rotate-180"}>
      <path d="M4 1 7.5 7h-7z" fill="currentColor" />
    </svg>
  );
}

// A change always names what it is measured against.
function Change({ now, before, against }: { now: number; before: number; against: string }) {
  const diff = now - before;
  if (diff === 0) return <span className="text-muted">Same as {against}</span>;
  return (
    <span className="text-muted">
      <span className={`inline-flex items-center gap-1 ${diff > 0 ? "text-positive" : "text-negative"}`}>
        <Triangle up={diff > 0} />
        {formatNumber(Math.abs(diff))}
      </span>{" "}
      vs {formatNumber(before)} {against}
    </span>
  );
}

function Cell({
  label,
  value,
  caption,
  className = "",
}: {
  label: string;
  value: number;
  caption: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-[13px] text-muted">{label}</div>
      <div className={`mt-1 text-[30px] font-medium leading-none tabular-nums ${value === 0 ? "text-muted" : ""}`}>
        {formatNumber(value)}
      </div>
      <div className="mt-2 text-[12px] leading-snug">{caption}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [overview, links] = await Promise.all([
    getOverview(user.id),
    db.link.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, slug: true, url: true, clickCount: true },
    }),
  ]);
  const { week, priorWeek, today, allTime, linkCount, topLink } = overview;

  // The one finding, read first
  let finding: React.ReactNode;
  if (linkCount === 0) finding = "No links yet. Make your first one.";
  else if (week === 0) finding = "No clicks in the last 7 days.";
  else if (topLink) {
    finding = (
      <>
        <span className="font-mono text-ink">/{topLink.slug}</span> got {formatNumber(topLink.n)} of this
        week&rsquo;s {formatNumber(week)} {week === 1 ? "click" : "clicks"}.
      </>
    );
  }

  return (
    <main className="flex-1 px-4 pb-10">
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight">Links</h1>
        <Link href="/new" className={primaryBtn}>
          New link
        </Link>
      </div>
      <p className="mt-1 text-muted">{finding}</p>

      <Card className="mt-4 grid grid-cols-2">
        <Cell
          label="Clicks, last 7 days"
          value={week}
          caption={<Change now={week} before={priorWeek} against="the 7 days before" />}
          className="border-b border-r border-border"
        />
        <Cell
          label="Clicks today"
          value={today}
          caption={<span className="text-muted">Day counted in UTC</span>}
          className="border-b border-border"
        />
        <Cell
          label="All-time clicks"
          value={allTime}
          caption={<span className="text-muted">Across {formatNumber(linkCount)} {linkCount === 1 ? "link" : "links"}</span>}
          className="border-r border-border"
        />
        <Cell
          label="Links"
          value={linkCount}
          caption={<span className="text-muted">Limit {formatNumber(MAX_LINKS_PER_USER)}</span>}
        />
      </Card>

      <Card className="mt-3 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 className="text-[16px] font-semibold">Clicks per day</h2>
          <div className="flex items-center gap-3 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[2px] bg-hue" /> Last 7 days
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[2px] bg-prior" /> 7 days before
            </span>
          </div>
        </div>
        <BarChart
          series={overview.series}
          splitAt={7}
          label={`Clicks per day over the last 14 days: ${formatNumber(week)} in the last 7, ${formatNumber(priorWeek)} in the 7 before.`}
        />
      </Card>

      <SectionHeading aside={links.length > 0 ? formatNumber(linkCount) : undefined}>All links</SectionHeading>
      <Card>
        {links.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-muted">Nothing shortened yet.</p>
            <Link href="/new" className={`${secondaryBtn} mt-4`}>
              Make a link
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-rule">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/links/${l.id}`}
                  className="flex min-h-[60px] items-center justify-between gap-3 px-4 py-2.5 active:bg-ground"
                >
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[15px]">/{l.slug}</div>
                    <div className="truncate text-[12px] text-muted">{shortUrl(l.url)}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`text-[16px] font-medium tabular-nums ${l.clickCount === 0 ? "text-muted" : ""}`}>
                      {formatNumber(l.clickCount)}
                    </div>
                    <div className="text-[12px] text-muted">{l.clickCount === 1 ? "click" : "clicks"}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
