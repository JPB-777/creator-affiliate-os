"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/urls", label: "URLs", icon: "🔗" },
  { href: "/links", label: "Affiliate Links", icon: "🏷️" },
  { href: "/earnings", label: "Earnings", icon: "💰" },
  { href: "/disclosures", label: "Disclosures", icon: "📝" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b bg-card px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard" className="text-lg font-bold">
                AffiliateOS
              </Link>
            </div>
            <div className="flex flex-1 flex-col">
              <NavContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="ml-3 text-lg font-bold">
          AffiliateOS
        </Link>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="text-lg font-bold">
            AffiliateOS
          </Link>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
