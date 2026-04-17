import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle";
import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";
import { NotificationPopover } from "@/components/shared/navigation/navbar/NotificationsPopover";
import { StoreSwitcher } from "@/components/shared/navigation/navbar/StoreSwitcher";
import {
  mainNavItems,
  secondaryNavItems,
} from "@/components/shared/navigation/nav-items";

export function MobileDrawer() {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col h-full w-[86vw] max-w-sm rounded-none border-r bg-background p-0">
        <DrawerHeader className="border-b px-4 py-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle className="flex items-center gap-3">
              <CareSyncLogoBadge
                size={38}
                tone="light"
                className="bg-linear-to-b from-[#0F766E] to-[#14B8A6]"
              />

              <span className="text-lg font-semibold">CareSync</span>
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <ThemeModeToggle className="size-9 border-primary/20 bg-primary/10 text-primary hover:bg-primary/15" />
              <NotificationPopover />
            </div>
          </div>
        </DrawerHeader>
        <DrawerDescription className="sr-only">
          Main navigation menu for CareSync.
        </DrawerDescription>

        <div className="border-b p-4">
          <StoreSwitcher />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.04,
                delayChildren: 0.08,
              },
            },
          }}
          className="grid gap-1"
        >
          <ScrollArea className="min-h-0 flex-1">
            <nav>
              {mainNavItems.map((item) => (
                <MobileDrawerLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
              <Separator className="my-3" />
              {secondaryNavItems.map((item) => (
                <MobileDrawerLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </nav>
          </ScrollArea>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

type MobileDrawerLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

function MobileDrawerLink({ to, icon, label }: MobileDrawerLinkProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <DrawerClose asChild>
        <Link
          to={to}
          className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium text-muted-foreground no-underline transition hover:bg-primary/10 hover:text-primary hover:no-underline"
          activeProps={{
            className: "bg-primary/10 text-primary",
          }}
        >
          <span className="flex size-5 items-center justify-center">
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      </DrawerClose>
    </motion.div>
  );
}
