import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

interface TagInfo {
  name: string;
  count: number;
}

export async function getAllUserTags(userId: string): Promise<TagInfo[]> {
  const rows = await db.execute(
    sql`SELECT tag, count(*) as count
        FROM ${urls}, jsonb_array_elements_text(${urls.tags}) as tag
        WHERE ${urls.userId} = ${userId}
        GROUP BY tag
        ORDER BY count DESC, tag ASC`
  );

  return (rows.rows as { tag: string; count: string }[]).map((r) => ({
    name: r.tag,
    count: parseInt(r.count, 10),
  }));
}
