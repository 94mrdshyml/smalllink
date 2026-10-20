"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentHost } from "@/lib/host";
import { requireUser } from "@/lib/session";
import { MAX_LINKS_PER_USER, normalizeUrl, randomSlug, validateSlug } from "@/lib/slug";

export type LinkFormState = {
  error?: { url?: string; slug?: string; form?: string };
  values?: { url: string; slug: string };
};

const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === "P2002";

export async function createLink(_prev: LinkFormState, formData: FormData): Promise<LinkFormState> {
  const user = await requireUser();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const values = { url: rawUrl, slug };

  const url = normalizeUrl(rawUrl, await currentHost());
  if ("error" in url) return { error: { url: url.error }, values };

  if (slug) {
    const problem = validateSlug(slug);
    if (problem) return { error: { slug: problem }, values };
  }

  const count = await db.link.count({ where: { userId: user.id } });
  if (count >= MAX_LINKS_PER_USER) {
    return { error: { form: `You've reached the limit of ${MAX_LINKS_PER_USER} links.` }, values };
  }

  let id: string | null = null;
  for (let attempt = 0; attempt < 5 && !id; attempt++) {
    try {
      const link = await db.link.create({
        data: { slug: slug || randomSlug(), url: url.value, userId: user.id },
        select: { id: true },
      });
      id = link.id;
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      // A custom slug that is taken is the user's to change. A random one just gets another go.
      if (slug) return { error: { slug: "That slug is taken. Try another." }, values };
    }
  }
  if (!id) return { error: { form: "Couldn't find a free slug. Try again." }, values };

  redirect(`/links/${id}`);
}

export async function deleteLink(id: string) {
  const user = await requireUser();
  // userId in the filter: you can only delete your own
  await db.link.deleteMany({ where: { id, userId: user.id } });
  redirect("/dashboard");
}
