"use server";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function renameTag(oldName: string, newName: string) {
  const user = await requireUser();
  if (!oldName.trim() || !newName.trim()) throw new Error("Tag name required");

  // Find all URLs with the old tag and replace it
  const userUrls = await db
    .select({ id: urls.id, tags: urls.tags })
    .from(urls)
    .where(eq(urls.userId, user.id));

  for (const url of userUrls) {
    const tags = (url.tags as string[]) ?? [];
    if (tags.includes(oldName)) {
      const newTags = tags.map((t) => (t === oldName ? newName : t));
      // Deduplicate
      const unique = [...new Set(newTags)];
      await db.update(urls).set({ tags: unique }).where(eq(urls.id, url.id));
    }
  }

  revalidatePath("/tags");
  revalidatePath("/urls");
}

export async function deleteTag(name: string) {
  const user = await requireUser();

  const userUrls = await db
    .select({ id: urls.id, tags: urls.tags })
    .from(urls)
    .where(eq(urls.userId, user.id));

  for (const url of userUrls) {
    const tags = (url.tags as string[]) ?? [];
    if (tags.includes(name)) {
      const newTags = tags.filter((t) => t !== name);
      await db.update(urls).set({ tags: newTags }).where(eq(urls.id, url.id));
    }
  }

  revalidatePath("/tags");
  revalidatePath("/urls");
}

export async function mergeTags(source: string, target: string) {
  return renameTag(source, target);
}
