"use server";

import { db } from "@/lib/db";
import { links, linkStatusHistory } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { checkLink } from "@/lib/scanner/checker";
import { logActivity } from "@/lib/activity-logger";

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

  // Record history
  try {
    await db.insert(linkStatusHistory).values({
      userId: user.id,
      urlId: link.urlId,
      linkOriginalUrl: link.originalUrl,
      networkName: link.networkName,
      status: result.status as "healthy" | "broken" | "redirect" | "timeout" | "unchecked",
      httpStatusCode: result.httpStatusCode,
      checkedAt: new Date(),
    });
  } catch {
    // best-effort
  }

  await logActivity({ userId: user.id, action: "link_rechecked", entityType: "link", entityId: id, metadata: { description: `${link.originalUrl} → ${result.status}` } });
  revalidatePath("/links");
  revalidatePath(`/urls/${link.urlId}`);
}

export async function suggestReplacement(linkId: string, newUrl: string) {
  const user = await requireUser();
  await db
    .update(links)
    .set({ suggestedReplacement: newUrl })
    .where(and(eq(links.id, linkId), eq(links.userId, user.id)));
  await logActivity({ userId: user.id, action: "link_replacement_suggested", entityType: "link", entityId: linkId, metadata: { description: newUrl } });
  revalidatePath("/links");
}
