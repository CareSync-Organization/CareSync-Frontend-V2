import type { LucideIcon } from "lucide-react";

import type { ChannelKey } from "@/features/integrations/types/channel.types";

export type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: LucideIcon;
  toneClassName: string;
  iconClassName: string;
};

export type ConversationTrendPoint = {
  month: string;
  aiHandled: number;
  humanHandled: number;
  total: number;
};

export type ChannelPerformanceRow = {
  channel: ChannelKey;
  conversationCount: number;
  aiSuccessRate: number;
  avgResponseMinutes: number;
};

export type AIAccuracyStatus = "resolved" | "escalated" | "handoff";

export type AIAccuracySegment = {
  status: AIAccuracyStatus;
  label: string;
  value: number;
  colorKey: string;
};

export type CustomerIntentRow = {
  intent: string;
  count: number;
  percentage: number;
};
