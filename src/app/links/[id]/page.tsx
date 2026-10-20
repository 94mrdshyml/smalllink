import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart } from "@/components/bar-chart";
import { BarList } from "@/components/bar-list";
import { CopyButton } from "@/components/copy-button";
import { DeleteButton } from "@/components/delete-button";
import { BackLink, Card, SectionHeading } from "@/components/ui";
import { db } from "@/lib/db";
import { countryName, formatNumber, shortUrl, timeAgo } from "@/lib/format";
import { currentOrigin } from "@/lib/host";
import { requireUser } from "@/lib/session";
import { getLinkStats } from "@/lib/stats";

export const metadata: Metadata = { title: "Link" };

const RANGES = [7, 30] as const;

export default async function LinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { range } = await searchParams;
  const days = range === "30" ? 30 : 7;

  const link = await db.link.findFirst({ where: { id, userId: user.id } });
  if (!link) notFound();

  const [stats, origin] = await Promise.all([getLinkStats(link.id, days), currentOrigin()]);
  const shortLink = `${origin}/${link.slug}`;
  const noCountry =
    stats.total > 0 && stats.countries.every((c) => c.label === "Unknown");

  return (
    <main className="flex-1 px-4 pb-10">
      <BackLink href="/dashboard">Links</BackLink>

      <h1 className="mt-1 break-all font-mono text-[22px] font-bold leading-tight">/{link.slug}</h1>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 block break-all text-muted underline-offset-2 hover:underline"
      >
        {shortUrl(link.url)}
      </a>

      <Card className="mt-4 p-4">
        <p className="break-all font-mono text-[15px]">{shortLink.replace(/^https?:\/\//, "")}</p>
        <div className="mt-3">
          <CopyButton text={shortLink} />
        </div>
      </Card>

      <nav aria-label="Time range" className="mt-6 flex border-b border-border">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/links/${link.id}?range=${r}`}
            replace
            scroll={false}
            aria-current={r === days ? "page" : undefined}
            className={`-mb-px flex h-11 items-center border-b-2 px-3 first:pl-0 ${
              r === days ? "border-ink font-medium" : "border-transparent text-muted"
            }`}
          >
            {r} days
          </Link>
        ))}
      </nav>

      <Card className="mt-4 divide-y divide-rule">
        <div className="flex items-baseline justify-between px-4 py-3">
          <span className="text-muted">Clicks, last {days} days</span>
          <span className={`text-[24px] font-medium tabular-nums ${stats.total === 0 ? "text-muted" : ""}`}>
            {formatNumber(stats.total)}
          </span>
        </div>
        <div className="flex items-baseline justify-between px-4 py-3">
          <span className="text-muted">All time</span>
          <span className={`text-[16px] font-medium tabular-nums ${link.clickCount === 0 ? "text-muted" : ""}`}>
            {formatNumber(link.clickCount)}
          </span>
        </div>
        <div className="flex items-baseline justify-between px-4 py-3">
          <span className="text-muted">Last click</span>
          <span className={stats.lastClickAt ? "" : "text-muted"}>
            {stats.lastClickAt ? timeAgo(stats.lastClickAt) : "—"}
          </span>
        </div>
      </Card>

      <Card className="mt-3 p-4">
        <h2 className="mb-4 text-[16px] font-semibold">Clicks per day</h2>
        <BarChart
          series={stats.series}
          label={`Clicks per day over the last ${days} days: ${formatNumber(stats.total)} in total.`}
        />
        <p className="mt-2 text-[12px] text-muted">Days are counted in UTC.</p>
      </Card>

      <SectionHeading aside={`Last ${days} days`}>Where from</SectionHeading>
      <Card>
        <BarList items={stats.referrers} empty="No clicks yet." />
      </Card>

      <SectionHeading>Countries</SectionHeading>
      <Card>
        {noCountry ? (
          <p className="px-4 py-4 text-muted">The host didn&rsquo;t report a country for these clicks.</p>
        ) : (
          <BarList
            items={stats.countries.map((c) => ({
              ...c,
              label: c.label === "Unknown" ? c.label : countryName(c.label),
            }))}
            empty="No clicks yet."
          />
        )}
      </Card>

      <SectionHeading>Devices</SectionHeading>
      <Card>
        <BarList items={stats.devices} empty="No clicks yet." />
      </Card>

      <SectionHeading>Browsers</SectionHeading>
      <Card>
        <BarList items={stats.browsers} empty="No clicks yet." />
      </Card>

      <div className="mt-10">
        <DeleteButton id={link.id} />
      </div>
    </main>
  );
}
