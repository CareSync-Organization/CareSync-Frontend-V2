import type { ChannelKey } from "@/features/integrations/types/channel.types";
import type { ConnectorStatus } from "../components/ConnectorCard";

export type Connector = {
  id?: string;
  channel: ChannelKey;
  description: string;
  status: ConnectorStatus;
  lastSynced?: string;
  displayName?: string;
  lastError?: string;
};

export const connectors: Connector[] = [
  {
    channel: "whatsapp",
    description: "Sync customer conversations from WhatsApp Business.",
    status: "available",
  },
  {
    channel: "shopify",
    description: "Connect your Shopify store for order and customer context.",
    status: "available",
  },
  {
    channel: "daraz",
    description: "Manage Daraz marketplace orders and customer inquiries.",
    status: "available",
  },
  {
    channel: "facebook",
    description: "Handle Facebook page and Messenger customer messages.",
    status: "available",
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
