import { AlertCircle, Check, RefreshCw, Settings } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { channelConfig } from "@/features/integrations/config/channel-config";
import type { ChannelKey } from "@/features/integrations/types/channel.types";
import { cn } from "@/lib/utils";

export type ConnectorStatus = "connected" | "error" | "available";

type ConnectorCardProps = {
  channel: ChannelKey;
  description: string;
  status: ConnectorStatus;
  lastSynced?: string;
  onConnect?: () => void;
  onConfigure?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
};

function ConnectorStatusBadge({ status }: { status: ConnectorStatus }) {
  if (status === "connected") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Check className="size-3.5" />
        Connected
      </Badge>
    );
  }

  if (status === "error") {
    return (
      <Badge className="bg-destructive/10 text-destructive">
        <AlertCircle className="size-3.5" />
        Error
      </Badge>
    );
  }

  return <Badge variant="secondary">Available</Badge>;
}

export function ConnectorCard({
  channel,
  description,
  status,
  lastSynced,
  onConnect,
  onConfigure,
  onDisconnect,
  onReconnect,
}: ConnectorCardProps) {
  const config = channelConfig[channel];
  const Icon = config.icon;

  return (
    <Card className="flex min-h-64 flex-col rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-xl border",
            config.iconBgClassName,
          )}
        >
          {typeof Icon === "string" ? (
            <img
              src={Icon}
              alt=""
              className="h-8 w-auto scale-125 object-contain"
            />
          ) : (
            <Icon className={cn("size-7", config.textClassName)} />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h2 className="font-semibold leading-none">{config.label}</h2>
          <ConnectorStatusBadge status={status} />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{description}</p>

      {status === "connected" && lastSynced ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="size-3.5" />
          <span>Last synced: {lastSynced}</span>
        </div>
      ) : null}

      <div className="mt-auto pt-5">
        {status === "connected" ? (
          <div className="flex flex-wrap gap-2">
            <ActionButton
              type="button"
              size="sm"
              startIcon={<Settings className="size-4" />}
              onClick={onConfigure}
            >
              Configure
            </ActionButton>
            <ActionButton
              type="button"
              size="sm"
              variant="secondary"
              onClick={onDisconnect}
            >
              Disconnect
            </ActionButton>
          </div>
        ) : status === "error" ? (
          <ActionButton
            type="button"
            size="sm"
            variant="destructive"
            fullWidth
            onClick={onReconnect}
          >
            Reconnect
          </ActionButton>
        ) : (
          <ActionButton type="button" size="sm" fullWidth onClick={onConnect}>
            Connect
          </ActionButton>
        )}
      </div>
    </Card>
  );
}
