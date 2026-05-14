import { useForm } from "@tanstack/react-form";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { channelConfig } from "@/features/integrations/config/channel-config";
import type { ChannelKey } from "@/features/integrations/types/channel.types";
import { cn } from "@/lib/utils";
import type { ConnectorStatus } from "./ConnectorCard";
import { getFieldError } from "@/lib/get-field-error";
import {
  connectorActionSchema,
  type ConnectorActionFormValues,
} from "@/features/connectors/schemas/connector-action.schema";

export type ConnectorAction = "connect" | "configure" | "reconnect";

export type ConnectorDialogTarget = {
  channel: ChannelKey;
  description: string;
  status: ConnectorStatus;
  lastSynced?: string;
};

type ConnectorActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorDialogTarget | null;
  action: ConnectorAction | null;
};

const actionCopy: Record<
  ConnectorAction,
  {
    titlePrefix: string;
    description: string;
    submitLabel: string;
  }
> = {
  connect: {
    titlePrefix: "Connect",
    description:
      "Add the account details CareSync will use to sync customer data for this store.",
    submitLabel: "Save Connection",
  },
  configure: {
    titlePrefix: "Configure",
    description:
      "Update connector credentials and sync settings for this store.",
    submitLabel: "Save Changes",
  },
  reconnect: {
    titlePrefix: "Reconnect",
    description:
      "Refresh the connector credentials and restore sync for this store.",
    submitLabel: "Reconnect",
  },
};

export function ConnectorActionDialog({
  open,
  onOpenChange,
  connector,
  action,
}: ConnectorActionDialogProps) {
  const form = useForm({
    defaultValues: {
      accountId: "",
      apiKey: "",
      webhookUrl: "",
    } as ConnectorActionFormValues,
    onSubmit: ({ value }) => {
      if (!connector || !action) return;

      console.log(`${action} connector`, {
        channel: connector.channel,
        ...value,
      });

      onOpenChange(false);
    },
  });

  if (!connector || !action) {
    return null;
  }

  const config = channelConfig[connector.channel];
  const Icon = config.icon;
  const copy = actionCopy[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-xl border",
                  config.iconBgClassName,
                )}
              >
                {typeof Icon === "string" ? (
                  <img
                    src={Icon}
                    alt=""
                    className="h-7 w-auto scale-125 object-contain"
                  />
                ) : (
                  <Icon className={cn("size-6", config.textClassName)} />
                )}
              </div>

              <div>
                <DialogTitle>
                  {copy.titlePrefix} {config.label}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {copy.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="grid gap-4">
              <form.Field
                name="accountId"
                validators={{
                  onChange: connectorActionSchema.shape.accountId,
                }}
              >
                {(field) => (
                  <TextInput
                    name={field.name}
                    label="Account identifier"
                    placeholder="Store URL, page ID, phone number, or account ID"
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </form.Field>

              <form.Field
                name="apiKey"
                validators={{
                  onChange: connectorActionSchema.shape.apiKey,
                }}
              >
                {(field) => (
                  <TextInput
                    name={field.name}
                    label="API key / access token"
                    placeholder="Paste temporary demo credentials"
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </form.Field>

              <form.Field
                name="webhookUrl"
                validators={{
                  onChange: connectorActionSchema.shape.webhookUrl,
                }}
              >
                {(field) => (
                  <TextInput
                    name={field.name}
                    label="Webhook URL"
                    placeholder="https://api.example.com/webhooks/channel"
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="rounded-xl border bg-muted/50 p-4 text-sm">
              <h3 className="font-semibold">Backend handoff</h3>
              <p className="mt-2 text-muted-foreground">
                This modal is intentionally generic until the backend chooses
                OAuth, API keys, or a hybrid connector flow.
              </p>
              <ul className="mt-4 grid gap-2 text-muted-foreground">
                <li>1. Save credentials securely server-side.</li>
                <li>2. Verify connection health.</li>
                <li>3. Start channel sync for this store.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <ActionButton type="button" variant="outline">
                Cancel
              </ActionButton>
            </DialogClose>
            <ActionButton
              type="submit"
              variant={action === "reconnect" ? "destructive" : "default"}
            >
              {copy.submitLabel}
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
