import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-utils";
import { getUnreadCount } from "@/server/queries/notifications";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ count: 0 });
  }

  const count = await getUnreadCount(user.id);
  return NextResponse.json({ count });
}
