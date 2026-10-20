import { after, NextResponse, type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { describeClick, isBot, recordClick } from "@/lib/clicks";

type Ctx = { params: Promise<{ slug: string }> };

async function find(ctx: Ctx) {
  const { slug } = await ctx.params;
  return db.link.findUnique({
    where: { slug: slug.toLowerCase() },
    select: { id: true, url: true },
  });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const link = await find(ctx);
  if (!link) notFound();

  if (!isBot(req.headers.get("user-agent") ?? "")) {
    const info = describeClick(req.headers, req.headers.get("host") ?? "");
    // after(): answer first, write the click once the response is out
    after(() => recordClick(link.id, info).catch((e) => console.error("click not recorded", e)));
  }

  // 307, not 301: a cached permanent redirect would hide repeat clicks
  return NextResponse.redirect(link.url, 307);
}

// Crawlers and link checkers probe with HEAD. Same answer, never counted.
export async function HEAD(_req: NextRequest, ctx: Ctx) {
  const link = await find(ctx);
  if (!link) notFound();
  return NextResponse.redirect(link.url, 307);
}
