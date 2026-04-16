import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
};

const demoNotifications: Notification[] = [
  {
    id: "1",
    title: "Shopify connection failed",
    description: "Reconnect your store to resume order sync.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "New conversation assigned",
    description: "A WhatsApp customer chat needs review.",
    time: "12 min ago",
    unread: true,
  },
  {
    id: "3",
    title: "AI resolution rate improved",
    description: "Automation handled 8.2% more tickets today.",
    time: "1 hr ago",
  },
];

export function NotificationPopover() {
  const unreadCount = demoNotifications.filter((item) => item.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 relative rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:border-primary/30 dark:bg-primary/20"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />

          {unreadCount > 0 ? (
            <span className="absolute -right-px -top-px size-2 rounded-full bg-red-500" />
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {unreadCount} unread updates
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {demoNotifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted"
            >
              <span
                className={cn(
                  "mt-1 size-2 shrink-0 rounded-full",
                  notification.unread ? "bg-primary" : "bg-transparent",
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t p-2">
          <Button variant="ghost" className="w-full justify-center">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
