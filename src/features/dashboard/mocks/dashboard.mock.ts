import type { ChannelKey } from "@/features/integrations/types/channel.types";

export const channelRows: Array<{
  channel: ChannelKey;
  label: string;
  count: number;
  percentage: number;
}> = [
  { channel: "whatsapp", label: "WhatsApp", count: 1245, percentage: 43.7 },
  { channel: "daraz", label: "Daraz", count: 543, percentage: 19.1 },
  { channel: "shopify", label: "Shopify", count: 721, percentage: 25.3 },
  { channel: "facebook", label: "Facebook", count: 214, percentage: 7.5 },
  { channel: "instagram", label: "Instagram", count: 124, percentage: 4.4 },
];
