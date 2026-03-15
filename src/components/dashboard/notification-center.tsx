"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  Info,
  CheckCheck,
} from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/server/actions/notifications";
import type { Notification } from "@/lib/db/schema";

interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRead: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  broken_link: <AlertTriangle className="h-4 w-4 text-destructive" />,
  scan_complete: <CheckCircle2 className="h-4 w-4 text-success" />,
  scan_failed: <XCircle className="h-4 w-4 text-destructive" />,
  weekly_report: <Mail className="h-4 w-4 text-primary" />,
  system: <Info className="h-4 w-4 text-muted-foreground" />,
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationCenter({
  open,
  onOpenChange,
  onRead,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch("/api/notifications/list")
      .then((r) => r.json())
      .then((data) => setNotifications(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  function handleMarkAsRead(id: string) {
    startTransition(async () => {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      onRead();
    });
  }

  function handleMarkAllAsRead() {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onRead();
    });
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:w-96 p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="text-xs"
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.isRead) handleMarkAsRead(n.id);
                    if (n.actionUrl) {
                      onOpenChange(false);
                      window.location.href = n.actionUrl;
                    }
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/50 ${
                    !n.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {typeIcons[n.type] ?? typeIcons.system}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <Badge variant="default" className="h-4 px-1 text-[10px]">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {timeAgo(new Date(n.createdAt))}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
