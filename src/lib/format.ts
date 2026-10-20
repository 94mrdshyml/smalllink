const LOCALE = "en-IN";

export const formatNumber = (n: number) => new Intl.NumberFormat(LOCALE).format(n);

// "20 Oct" from a YYYY-MM-DD string
export function formatDay(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function timeAgo(date: Date, now = new Date()) {
  const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} d ago`;
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(code: string) {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

// Address without scheme, leading www and trailing slash
export function shortUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}
