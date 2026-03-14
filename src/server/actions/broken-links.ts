"use server";

import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { checkLink } from "@/lib/scanner/checker";

export async function batchRecheckLinks(linkIds: string[]) {
  const user = await requireUser();
  if (linkIds.length === 0) return { rechecked: 0, stillBroken: 0, fixed: 0 };
  if (linkIds.length > 20) throw new Error("Maximum 20 links per batch");

  const userLinks = await db
    .select()
    .from(links)
    .where(and(inArray(links.id, linkIds), eq(links.userId, user.id)));

  let stillBroken = 0;
  let fixed = 0;

  for (const link of userLinks) {
    const result = await checkLink(link.originalUrl);
    await db
      .update(links)
      .set({
        status: result.status,
        httpStatusCode: result.httpStatusCode,
        resolvedUrl: result.resolvedUrl,
        lastCheckedAt: new Date(),
      })
      .where(eq(links.id, link.id));

    if (result.status === "broken") {
      stillBroken++;
    } else {
      fixed++;
    }
  }

  revalidatePath("/broken-links");
  revalidatePath("/links");
  revalidatePath("/dashboard");

  return { rechecked: userLinks.length, stillBroken, fixed };
}

export async function dismissBrokenLink(linkId: string) {
  const user = await requireUser();
  await db
    .update(links)
    .set({ status: "unchecked", lastCheckedAt: new Date() })
    .where(and(eq(links.id, linkId), eq(links.userId, user.id)));

  revalidatePath("/broken-links");
  revalidatePath("/links");
  revalidatePath("/dashboard");
}

export async function batchDismissLinks(linkIds: string[]) {
  const user = await requireUser();
  if (linkIds.length === 0) return;

  await db
    .update(links)
    .set({ status: "unchecked", lastCheckedAt: new Date() })
    .where(and(inArray(links.id, linkIds), eq(links.userId, user.id)));

  revalidatePath("/broken-links");
  revalidatePath("/links");
  revalidatePath("/dashboard");
}
