import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useHasPermission } from "@/lib/hooks/useHasPermission";
import { queryKeys } from "@/lib/query-keys";

import { useStoreConnectors } from "../api/connectors.queries";
import { connectors } from "../mocks/connectors.mock";
import type { ConnectorRecord } from "../types/connectors.types";
import { ConnectorCard } from "./ConnectorCard";
import { RequestIntegrationDialog } from "./RequestIntegrationDialog";
import { WhatsAppConfigureDialog } from "./whatsapp/ConfigureDialog";
import { WhatsAppConnectDialog } from "./whatsapp/ConnectDialog";
import { WhatsAppDisconnectDialog } from "./whatsapp/DisconnectDialog";
import { ShopifyConfigureDialog } from "./shopify/ConfigureDialog";
import { ShopifyConnectDialog } from "./shopify/ConnectDialog";
import { ShopifyDisconnectDialog } from "./shopify/DisconnectDialog";
import { DarazConfigureDialog } from "./daraz/ConfigureDialog";
import { DarazConnectDialog } from "./daraz/ConnectDialog";
import { DarazDisconnectDialog } from "./daraz/DisconnectDialog";

type ConnectorDialogState =
  | { type: "connect" }
  | { type: "reconnect" }
  | { type: "configure"; connector: ConnectorRecord }
  | { type: "disconnect"; connector: ConnectorRecord }
  | null;

function noWriteAccess() {
  toast.error("You need write access to manage connectors.");
}

export function ConnectorsPage() {
  const queryClient = useQueryClient();
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: storeConnectors = [], isLoading } = useStoreConnectors(
    activeStoreId ?? undefined,
  );
  const canWrite = useHasPermission("connectors", "write");

  const [isRequestIntegrationOpen, setIsRequestIntegrationOpen] =
    useState(false);
  const [whatsAppDialog, setWhatsAppDialog] =
    useState<ConnectorDialogState>(null);
  const [shopifyDialog, setShopifyDialog] =
    useState<ConnectorDialogState>(null);
  const [darazDialog, setDarazDialog] =
    useState<ConnectorDialogState>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackStatus = params.get("status");

    // Daraz includes the originating client platform on its callback.
    if (!callbackStatus || params.get("platform") !== "web") return;
    if (callbackStatus === "connected" && !activeStoreId) return;

    params.delete("status");
    params.delete("connector_id");
    params.delete("platform");
    const cleanSearch = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${window.location.hash}`,
    );

    if (callbackStatus === "connected") {
      queryClient.invalidateQueries({
        queryKey: queryKeys.connectors.list(activeStoreId!),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory.list(activeStoreId!),
      });
      toast.success("Daraz connected. Inventory sync and message checking have started.");
      return;
    }

    if (callbackStatus === "failed") {
      toast.error(
        "Daraz connection failed. Confirm the seller marketplace and try again.",
      );
    }
  }, [activeStoreId, queryClient]);

  const connectorCards = connectors.map((connector) => {
    const backendConnector =
      storeConnectors.find((item) => item.channel === connector.channel) ?? null;

    if (!backendConnector) return { ...connector, backendConnector: null };

    return {
      ...connector,
      backendConnector,
      status:
        backendConnector.status === "active"
          ? ("connected" as const)
          : backendConnector.status === "failed"
            ? ("error" as const)
            : ("available" as const),
      lastSynced: new Date(backendConnector.updatedAt).toLocaleString(),
      displayName: backendConnector.displayName,
      lastError: backendConnector.lastError,
    };
  });

  return (
    <section className="space-y-6">
      <div>
        <h1>Stores & Connectors</h1>
        <p className="text-muted-foreground">
          Manage your sales channels and communication platform integrations.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">Main Store</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex min-h-64 flex-col rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="size-14 shrink-0 rounded-xl bg-muted animate-pulse" />
                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted animate-pulse" />
                    <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="mt-auto pt-5">
                    <div className="h-8 w-full rounded-lg bg-muted animate-pulse" />
                  </div>
                </div>
              ))
            : connectorCards.map((connector) => {
            const backendConnector = connector.backendConnector;

            return (
              <ConnectorCard
                key={connector.channel}
                channel={connector.channel}
                description={connector.description}
                status={connector.status}
                lastSynced={connector.lastSynced}
                onConnect={() => {
                  if (!canWrite) return noWriteAccess();
                  if (connector.channel === "whatsapp") {
                    setWhatsAppDialog({ type: "connect" });
                  }
                  if (connector.channel === "shopify") {
                    setShopifyDialog({ type: "connect" });
                  }
                  if (connector.channel === "daraz") {
                    setDarazDialog({ type: "connect" });
                  }
                }}
                onConfigure={() => {
                  if (connector.channel === "whatsapp" && backendConnector) {
                    setWhatsAppDialog({
                      type: "configure",
                      connector: backendConnector,
                    });
                  }
                  if (connector.channel === "shopify" && backendConnector) {
                    setShopifyDialog({
                      type: "configure",
                      connector: backendConnector,
                    });
                  }
                  if (connector.channel === "daraz" && backendConnector) {
                    setDarazDialog({
                      type: "configure",
                      connector: backendConnector,
                    });
                  }
                }}
                onDisconnect={() => {
                  if (!canWrite) return noWriteAccess();
                  if (connector.channel === "whatsapp" && backendConnector) {
                    setWhatsAppDialog({
                      type: "disconnect",
                      connector: backendConnector,
                    });
                  }
                  if (connector.channel === "shopify" && backendConnector) {
                    setShopifyDialog({
                      type: "disconnect",
                      connector: backendConnector,
                    });
                  }
                  if (connector.channel === "daraz" && backendConnector) {
                    setDarazDialog({
                      type: "disconnect",
                      connector: backendConnector,
                    });
                  }
                }}
                onReconnect={() => {
                  if (!canWrite) return noWriteAccess();
                  if (connector.channel === "whatsapp") {
                    setWhatsAppDialog({ type: "reconnect" });
                  }
                  if (connector.channel === "shopify") {
                    setShopifyDialog({ type: "reconnect" });
                  }
                  if (connector.channel === "daraz") {
                    setDarazDialog({ type: "reconnect" });
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-linear-to-b from-[#0F766E] to-[#14B8A6] p-5 text-primary-foreground shadow-sm">
        <h2 className="text-base font-semibold">Need More Integrations?</h2>
        <p className="mt-2 max-w-3xl text-sm text-primary-foreground/80">
          We're constantly adding new platform integrations. Contact your team
          to request a custom connector.
        </p>
        <ActionButton
          type="button"
          variant="secondary"
          className="mt-4 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => setIsRequestIntegrationOpen(true)}
        >
          Request Integration
        </ActionButton>
      </div>

      <RequestIntegrationDialog
        open={isRequestIntegrationOpen}
        onOpenChange={setIsRequestIntegrationOpen}
      />

      <WhatsAppConnectDialog
        open={
          whatsAppDialog?.type === "connect" ||
          whatsAppDialog?.type === "reconnect"
        }
        onOpenChange={(open) => {
          if (!open) setWhatsAppDialog(null);
        }}
      />

      <WhatsAppConfigureDialog
        open={whatsAppDialog?.type === "configure"}
        onOpenChange={(open) => {
          if (!open) setWhatsAppDialog(null);
        }}
        connector={
          whatsAppDialog?.type === "configure" ? whatsAppDialog.connector : null
        }
      />

      <WhatsAppDisconnectDialog
        open={whatsAppDialog?.type === "disconnect"}
        onOpenChange={(open) => {
          if (!open) setWhatsAppDialog(null);
        }}
        connector={
          whatsAppDialog?.type === "disconnect"
            ? whatsAppDialog.connector
            : null
        }
      />
      <ShopifyConnectDialog
        open={
          shopifyDialog?.type === "connect" ||
          shopifyDialog?.type === "reconnect"
        }
        onOpenChange={(open) => {
          if (!open) setShopifyDialog(null);
        }}
      />

      <ShopifyConfigureDialog
        open={shopifyDialog?.type === "configure"}
        onOpenChange={(open) => {
          if (!open) setShopifyDialog(null);
        }}
        connector={
          shopifyDialog?.type === "configure" ? shopifyDialog.connector : null
        }
        readOnly={!canWrite}
      />

      <ShopifyDisconnectDialog
        open={shopifyDialog?.type === "disconnect"}
        onOpenChange={(open) => {
          if (!open) setShopifyDialog(null);
        }}
        connector={
          shopifyDialog?.type === "disconnect"
            ? shopifyDialog.connector
            : null
        }
      />
      <DarazConnectDialog
        open={
          darazDialog?.type === "connect" ||
          darazDialog?.type === "reconnect"
        }
        onOpenChange={(open) => {
          if (!open) setDarazDialog(null);
        }}
      />

      <DarazConfigureDialog
        open={darazDialog?.type === "configure"}
        onOpenChange={(open) => {
          if (!open) setDarazDialog(null);
        }}
        connector={
          darazDialog?.type === "configure" ? darazDialog.connector : null
        }
        readOnly={!canWrite}
      />

      <DarazDisconnectDialog
        open={darazDialog?.type === "disconnect"}
        onOpenChange={(open) => {
          if (!open) setDarazDialog(null);
        }}
        connector={
          darazDialog?.type === "disconnect" ? darazDialog.connector : null
        }
      />
    </section>
  );
}
