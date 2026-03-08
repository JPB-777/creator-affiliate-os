"use server";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { triggerScan } from "./scans";

export async function addUrl(formData: FormData) {
  const user = await requireUser();
  const url = formData.get("url") as string;
  const platform = (formData.get("platform") as string) || "blog";

  if (!url) throw new Error("URL is required");

  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  const [newUrl] = await db
    .insert(urls)
    .values({
      userId: user.id,
      url: normalizedUrl,
      platform,
    })
    .returning();

  // Auto-trigger scan
  await triggerScan(newUrl.id, user.id);

  revalidatePath("/urls");
  revalidatePath("/dashboard");
  return newUrl;
}

export async function deleteUrl(id: string) {
  const user = await requireUser();
  await db
    .delete(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, user.id)));
  revalidatePath("/urls");
  revalidatePath("/dashboard");
}

export async function rescanUrl(id: string) {
  const user = await requireUser();
  await triggerScan(id, user.id);
  revalidatePath(`/urls/${id}`);
  revalidatePath("/urls");
  revalidatePath("/dashboard");
}
