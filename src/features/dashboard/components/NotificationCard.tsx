import { TriangleAlert, Info, ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NotificationCardType = "alert" | "info" | "success";

type NotificationCardProps = {
  type: NotificationCardType;
  message: string;
  buttonText: string;
  onClick: () => void;
  onDismiss?: () => void;
};

const notificationConfig = {
  alert: {
    Icon: TriangleAlert,
    containerClassName: "bg-red-500/20 border-red-500/50",
    iconClassName: "text-red-500",
    buttonClassName: "bg-red-500 hover:bg-red-500/40",
  },
  info: {
    Icon: Info,
    containerClassName: "bg-blue-500/10 border-blue-500/50",
    iconClassName: "text-blue-500",
    buttonClassName: "bg-blue-500 hover:bg-blue-500/40",
  },
  success: {
    Icon: ShieldCheck,
    containerClassName: "bg-green-500/10 border-green-500/50",
    iconClassName: "text-green-500",
    buttonClassName: "bg-green-500 hover:bg-green-500/40",
  },
} satisfies Record<
  NotificationCardType,
  {
    Icon: React.ElementType;
    containerClassName: string;
    iconClassName: string;
    buttonClassName: string;
  }
>;

export function NotificationCard({
  type,
  message,
  buttonText,
  onClick,
  onDismiss,
}: NotificationCardProps) {
  const { Icon, containerClassName, iconClassName, buttonClassName } =
    notificationConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.54, ease: "easeOut" }}
      className={cn(
        "flex gap-3 rounded-xl border-2 p-3 sm:items-center justify-between lg:p-4",
        containerClassName,
      )}
    >
      <div className="inline-flex gap-2 justify-center items-center">
        <Icon size={24} className={iconClassName} />
        <p className="text-foreground">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onClick}
          className={cn("px-3 py-2 text-white shrink-0", buttonClassName)}
        >
          {buttonText}
        </Button>
        {onDismiss ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="size-8 shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
