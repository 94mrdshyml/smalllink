import { db } from "./db";

export type ClickInfo = {
  referrer: string | null;
  country: string | null;
  device: string;
  browser: string;
};

// Link-preview fetchers and scripts. They load the link without a person behind it.
const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|curl|wget|python-requests|headless|monitor|uptime/i;

export function isBot(ua: string) {
  return !ua || BOT.test(ua);
}

function deviceOf(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobi|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function browserOf(ua: string) {
  if (/instagram/i.test(ua)) return "Instagram";
  if (/fban|fbav/i.test(ua)) return "Facebook";
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua)) return "Opera";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function referrerOf(header: string | null, ownHost: string) {
  if (!header) return null;
  try {
    const host = new URL(header).host.replace(/^www\./, "");
    return host === ownHost.replace(/^www\./, "") ? null : host;
  } catch {
    return null;
  }
}

export function describeClick(headers: Headers, ownHost: string): ClickInfo {
  const ua = headers.get("user-agent") ?? "";
  // The host sets this header (Vercel does). Without it the country stays unknown.
  const country = headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry");
  return {
    referrer: referrerOf(headers.get("referer"), ownHost),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    device: deviceOf(ua),
    browser: browserOf(ua),
  };
}

export async function recordClick(linkId: string, info: ClickInfo) {
  await db.$transaction([
    db.click.create({ data: { linkId, ...info } }),
    db.link.update({ where: { id: linkId }, data: { clickCount: { increment: 1 } } }),
  ]);
}
