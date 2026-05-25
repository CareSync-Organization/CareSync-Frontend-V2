import type { TeamMember } from "../types/users.types";

export const demoMembers: TeamMember[] = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "user_2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "agent",
    status: "active",
    lastActive: "5 minutes ago",
    permissions: {
      inventory: "read",
      conversations: "write",
      knowledgeBase: "read",
      analytics: "read",
      connectors: "none",
    },
  },
  {
    id: "user_3",
    name: "Mike Chen",
    email: "mike@example.com",
    role: "agent",
    status: "active",
    lastActive: "1 day ago",
    permissions: {
      inventory: "write",
      conversations: "write",
      knowledgeBase: "write",
      analytics: "none",
      connectors: "none",
    },
  },
  {
    id: "user_4",
    name: "Emma Johnson",
    email: "emma@example.com",
    role: "agent",
    status: "pending",
    lastActive: null,
    permissions: {
      inventory: "none",
      conversations: "read",
      knowledgeBase: "none",
      analytics: "none",
      connectors: "none",
    },
  },
];
