import { randomInt } from "node:crypto";

// Top-level routes of the app. A slug with one of these names would never be reached.
const RESERVED = new Set([
  "api", "login", "signup", "dashboard", "new", "links", "account", "settings",
  "admin", "about", "help", "terms", "privacy", "favicon.ico", "icon.svg",
  "robots.txt", "sitemap.xml", "_next",
]);

export const SLUG_MIN = 3;
export const SLUG_MAX = 32;
export const MAX_LINKS_PER_USER = 500;

export function validateSlug(slug: string): string | null {
  if (slug.length < SLUG_MIN || slug.length > SLUG_MAX) {
    return `Use ${SLUG_MIN} to ${SLUG_MAX} characters.`;
  }
  if (!/^[a-z0-9][a-z0-9_-]*[a-z0-9]$/.test(slug)) {
    return "Use letters, numbers, - and _. Start and end with a letter or number.";
  }
  if (RESERVED.has(slug)) return "That name is reserved.";
  return null;
}

// No 0/o, 1/l/i: easy to read out loud
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function randomSlug(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

export function normalizeUrl(
  raw: string,
  ownHost: string,
): { value: string } | { error: string } {
  if (!raw) return { error: "Paste the address you want to shorten." };
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return { error: "That doesn't look like a web address." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { error: "Only http and https addresses work." };
  }
  if (!url.hostname.includes(".")) return { error: "That doesn't look like a web address." };
  if (url.host.toLowerCase() === ownHost.toLowerCase()) {
    return { error: "That points back at smalllink." };
  }
  if (url.href.length > 2048) return { error: "That address is too long." };
  return { value: url.href };
}
