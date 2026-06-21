import { useState } from "react";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

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

type WhatsAppDialogState =
  | { type: "connect" }
  | { type: "reconnect" }
  | { type: "configure"; connector: ConnectorRecord }
  | { type: "disconnect"; connector: ConnectorRecord }
  | null;

type ShopifyDialogState =
  | { type: "connect" }
  | { type: "reconnect" }
  | { type: "configure"; connector: ConnectorRecord }
  | { type: "disconnect"; connector: ConnectorRecord }
  | null;

export function ConnectorsPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: storeConnectors = [] } = useStoreConnectors(
    activeStoreId ?? undefined,
  );

  const [isRequestIntegrationOpen, setIsRequestIntegrationOpen] =
    useState(false);
  const [whatsAppDialog, setWhatsAppDialog] =
    useState<WhatsAppDialogState>(null);
  const [shopifyDialog, setShopifyDialog] =
    useState<ShopifyDialogState>(null);

  const connectorCards = connectors.map((connector) => {
    const backendConnector = storeConnectors.find(
      (item) => item.channel === connector.channel,
    );

    if (!backendConnector) return connector;

    return {
      ...connector,
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
          {connectorCards.map((connector) => {
            const backendConnector = storeConnectors.find(
              (item) => item.channel === connector.channel,
            );

            return (
              <ConnectorCard
                key={connector.channel}
                channel={connector.channel}
                description={connector.description}
                status={connector.status}
                lastSynced={connector.lastSynced}
                onConnect={() => {
                  if (connector.channel === "whatsapp") {
                    setWhatsAppDialog({ type: "connect" });
                  }
                  if (connector.channel === "shopify") {
                    setShopifyDialog({ type: "connect" });
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
                }}
                onDisconnect={() => {
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
                }}
                onReconnect={() => {
                  if (connector.channel === "whatsapp") {
                    setWhatsAppDialog({ type: "reconnect" });
                  }
                  if (connector.channel === "shopify") {
                    setShopifyDialog({ type: "reconnect" });
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
    </section>
  );
}
