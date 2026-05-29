import {
  Bot,
  Clock3,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import type {
  AIAccuracySegment,
  AnalyticsMetric,
  ChannelPerformanceRow,
  ConversationTrendPoint,
  CustomerIntentRow,
} from "../types/analytics.types";

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: "total-conversations",
    label: "Total Conversations",
    value: "2,847",
    trend: 12.5,
    trendLabel: "+12.5%",
    icon: MessageSquare,
    toneClassName: "bg-primary/10",
    iconClassName: "text-primary",
  },
  {
    id: "ai-success-rate",
    label: "AI Success Rate",
    value: "75%",
    trend: 8.2,
    trendLabel: "+8.2%",
    icon: Bot,
    toneClassName: "bg-violet-500/10",
    iconClassName: "text-violet-500",
  },
  {
    id: "avg-response-time",
    label: "Avg Response Time",
    value: "2.3 min",
    trend: -15,
    trendLabel: "-15%",
    icon: Clock3,
    toneClassName: "bg-emerald-500/10",
    iconClassName: "text-emerald-500",
  },
  {
    id: "customer-satisfaction",
    label: "Customer Satisfaction",
    value: "4.8/5",
    trend: 18,
    trendLabel: "+18%",
    icon: TrendingUp,
    toneClassName: "bg-orange-500/10",
    iconClassName: "text-orange-500",
  },
];

export const conversationTrends: ConversationTrendPoint[] = [
  { month: "Jun", aiHandled: 480,  humanHandled: 180, total: 660  },
  { month: "Jul", aiHandled: 920,  humanHandled: 320, total: 1240 },
  { month: "Aug", aiHandled: 1210, humanHandled: 380, total: 1590 },
  { month: "Sep", aiHandled: 1430, humanHandled: 410, total: 1840 },
  { month: "Oct", aiHandled: 1680, humanHandled: 485, total: 2165 },
  { month: "Nov", aiHandled: 1830, humanHandled: 560, total: 2390 },
  { month: "Dec", aiHandled: 2105, humanHandled: 620, total: 2725 },
  { month: "Jan", aiHandled: 2140, humanHandled: 720, total: 2860 },
  { month: "Feb", aiHandled: 2280, humanHandled: 750, total: 3030 },
  { month: "Mar", aiHandled: 2410, humanHandled: 790, total: 3200 },
  { month: "Apr", aiHandled: 2560, humanHandled: 830, total: 3390 },
  { month: "May", aiHandled: 2690, humanHandled: 870, total: 3560 },
];

export const channelPerformance: ChannelPerformanceRow[] = [
  {
    channel: "whatsapp",
    conversationCount: 1245,
    aiSuccessRate: 82,
    avgResponseMinutes: 3.2,
  },
  {
    channel: "shopify",
    conversationCount: 721,
    aiSuccessRate: 75,
    avgResponseMinutes: 4.1,
  },
  {
    channel: "daraz",
    conversationCount: 543,
    aiSuccessRate: 68,
    avgResponseMinutes: 5.3,
  },
  {
    channel: "facebook",
    conversationCount: 214,
    aiSuccessRate: 71,
    avgResponseMinutes: 4.7,
  },
  {
    channel: "instagram",
    conversationCount: 124,
    aiSuccessRate: 65,
    avgResponseMinutes: 5.8,
  },
];

export const aiAccuracyBreakdown: AIAccuracySegment[] = [
  {
    status: "resolved",
    label: "Resolved",
    value: 2134,
    colorKey: "resolved",
  },
  {
    status: "escalated",
    label: "Escalated",
    value: 127,
    colorKey: "escalated",
  },
  {
    status: "handoff",
    label: "Handoff",
    value: 586,
    colorKey: "handoff",
  },
];

export const customerIntents: CustomerIntentRow[] = [
  { intent: "Order Status", count: 842, percentage: 29.6 },
  { intent: "Product Inquiry", count: 625, percentage: 22 },
  { intent: "Shipping Info", count: 481, percentage: 16.9 },
  { intent: "Return/Refund", count: 387, percentage: 13.6 },
  { intent: "Payment Issue", count: 298, percentage: 10.5 },
  { intent: "Other", count: 214, percentage: 7.4 },
];
