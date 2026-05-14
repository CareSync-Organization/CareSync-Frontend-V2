import { useState } from "react";
import { Plus } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { AddStoreDialog } from "./AddStoreDialog";
import {
  ConnectorActionDialog,
  type ConnectorAction,
} from "./ConnectorActionDialog";
import { ConnectorCard } from "./ConnectorCard";
import { DisconnectConnectorDialog } from "./DisconnectConnectorDialog";
import { RequestIntegrationDialog } from "./RequestIntegrationDialog";
import { type Connector, connectors } from "../mocks/connectors.mock";

export function ConnectorsPage() {
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isRequestIntegrationOpen, setIsRequestIntegrationOpen] =
    useState(false);
  const [connectorAction, setConnectorAction] = useState<{
    connector: Connector;
    action: ConnectorAction;
  } | null>(null);
  const [disconnectConnector, setDisconnectConnector] =
    useState<Connector | null>(null);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>Stores & Connectors</h1>
          <p className="text-muted-foreground">
            Manage your sales channels and communication platform integrations.
          </p>
        </div>

        <ActionButton
          type="button"
          startIcon={<Plus className="size-4" />}
          className="w-fit"
          onClick={() => setIsAddStoreOpen(true)}
        >
          Add Store
        </ActionButton>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">Main Store</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {connectors.map((connector) => (
            <ConnectorCard
              key={connector.channel}
              channel={connector.channel}
              description={connector.description}
              status={connector.status}
              lastSynced={connector.lastSynced}
              onConnect={() =>
                setConnectorAction({ connector, action: "connect" })
              }
              onConfigure={() =>
                setConnectorAction({ connector, action: "configure" })
              }
              onDisconnect={() => setDisconnectConnector(connector)}
              onReconnect={() =>
                setConnectorAction({ connector, action: "reconnect" })
              }
            />
          ))}
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

      <AddStoreDialog
        open={isAddStoreOpen}
        onOpenChange={setIsAddStoreOpen}
      />
      <RequestIntegrationDialog
        open={isRequestIntegrationOpen}
        onOpenChange={setIsRequestIntegrationOpen}
      />
      <ConnectorActionDialog
        open={connectorAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConnectorAction(null);
          }
        }}
        connector={connectorAction?.connector ?? null}
        action={connectorAction?.action ?? null}
      />
      <DisconnectConnectorDialog
        open={disconnectConnector !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDisconnectConnector(null);
          }
        }}
        connector={disconnectConnector}
      />
    </section>
  );
}
