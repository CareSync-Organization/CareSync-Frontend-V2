import type { ChannelKey } from "@/features/integrations/types/channel.types";
import type { ConnectorStatus } from "../components/ConnectorCard";

export type Connector = {
  channel: ChannelKey;
  description: string;
  status: ConnectorStatus;
  lastSynced?: string;
};

export const connectors: Connector[] = [
  {
    channel: "whatsapp",
    description: "Sync customer conversations from WhatsApp Business.",
    status: "connected",
    lastSynced: "2 minutes ago",
  },
  {
    channel: "shopify",
    description: "Connect your Shopify store for order and customer context.",
    status: "error",
  },
  {
    channel: "daraz",
    description: "Manage Daraz marketplace orders and customer inquiries.",
    status: "connected",
    lastSynced: "5 minutes ago",
  },
  {
    channel: "facebook",
    description: "Handle Facebook page and Messenger customer messages.",
    status: "connected",
    lastSynced: "1 hour ago",
  },
  {
    channel: "instagram",
    description: "Respond to Instagram direct messages from one inbox.",
    status: "available",
  },
  {
    channel: "email",
    description: "Connect your support email for customer support tickets.",
    status: "available",
  },
];
