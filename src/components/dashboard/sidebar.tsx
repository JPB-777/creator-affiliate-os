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
import {
  MenuIcon,
  LayoutDashboard,
  Globe,
  Link2,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  User,
  AlertTriangle,
  Tag,
  Activity,
  Sparkles,
  GitCompareArrows,
} from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { NotificationBell } from "@/components/dashboard/notification-bell";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/urls", label: "URLs", icon: Globe },
  { href: "/links", label: "Affiliate Links", icon: Link2 },
  { href: "/broken-links", label: "Broken Links", icon: AlertTriangle },
  { href: "/opportunities", label: "Opportunities", icon: Sparkles },
  { href: "/earnings", label: "Earnings", icon: DollarSign },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/content-drift", label: "Content Drift", icon: GitCompareArrows },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/disclosures", label: "Disclosures", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavContent({
  onNavigate,
  userName,
  userEmail,
}: {
  onNavigate?: () => void;
  userName?: string;
  userEmail?: string;
}) {
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3 space-y-1">
        {(userName || userEmail) && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              {userName && (
                <p className="truncate text-sm font-medium">{userName}</p>
              )}
              {userEmail && (
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              )}
            </div>
          </div>
        )}
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export function Sidebar({
  userName,
  userEmail,
}: {
  userName?: string;
  userEmail?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b bg-card/80 backdrop-blur-sm px-4 md:hidden">
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
            <div className="flex h-14 items-center gap-2.5 border-b px-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Link2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <Link href="/dashboard" className="text-lg font-bold">
                AffiliateOS
              </Link>
            </div>
            <div className="flex flex-1 flex-col">
              <NavContent
                onNavigate={() => setOpen(false)}
                userName={userName}
                userEmail={userEmail}
              />
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-3 flex flex-1 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <Link href="/dashboard" className="text-lg font-bold">
            AffiliateOS
          </Link>
        </div>
        <NotificationBell />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <Link href="/dashboard" className="flex-1 text-lg font-bold">
            AffiliateOS
          </Link>
          <NotificationBell />
        </div>
        <NavContent userName={userName} userEmail={userEmail} />
      </aside>
    </>
  );
}
