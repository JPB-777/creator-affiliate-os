"use server";

import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { checkLink } from "@/lib/scanner/checker";

export async function recheckLink(id: string) {
  const user = await requireUser();

  const [link] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, user.id)));

  if (!link) throw new Error("Link not found");

  const result = await checkLink(link.originalUrl);

  await db
    .update(links)
    .set({
      status: result.status,
      httpStatusCode: result.httpStatusCode,
      resolvedUrl: result.resolvedUrl,
      lastCheckedAt: new Date(),
    })
    .where(eq(links.id, id));

  revalidatePath("/links");
  revalidatePath(`/urls/${link.urlId}`);
}

export async function suggestReplacement(linkId: string, newUrl: string) {
  const user = await requireUser();
  await db
    .update(links)
    .set({ suggestedReplacement: newUrl })
    .where(and(eq(links.id, linkId), eq(links.userId, user.id)));
  revalidatePath("/links");
}
