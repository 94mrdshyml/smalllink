import { headers } from "next/headers";

export async function currentHost() {
  const h = await headers();
  return h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
}

export async function currentOrigin() {
  const h = await headers();
  const host = await currentHost();
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
