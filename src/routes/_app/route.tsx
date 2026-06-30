import { Navbar } from "@/components/shared/navigation/navbar/Navbar";
import { Sidebar } from "@/components/shared/navigation/sidebar/Sidebar";
import {
  createFileRoute,
  Outlet,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { queryKeys } from "@/lib/query-keys";
import { getMe } from "@/features/auth/api/auth.api";
import { mapUserDto } from "@/features/auth/api/auth.mapper";
import { getMyPermissions } from "@/features/stores/api/permissions.api";

import { useStores } from "@/features/stores/api/stores.queries";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useEffect } from "react";
import { useNotificationsSocket } from "@/features/notifications/hooks/useNotificationsSocket";
import { useConversationSocket } from "@/features/conversation/hooks/useConversationsSocket";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const ME_STALE_MS = 5 * 60 * 1000;

    try {
      const activeStoreId = useActiveStoreStore.getState().activeStoreId;
      await Promise.all([
        context.queryClient.ensureQueryData({
          queryKey: queryKeys.auth.me(),
          queryFn: async () => mapUserDto(await getMe()),
          staleTime: ME_STALE_MS,
        }),
        activeStoreId
          ? context.queryClient.ensureQueryData({
              queryKey: queryKeys.permissions.my(activeStoreId),
              queryFn: () => getMyPermissions(activeStoreId),
              staleTime: Infinity,
            })
          : Promise.resolve(),
      ]);
    } catch (error) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const topSegment = pathname.split("/")[1];

  const { data: stores = [], isLoading } = useStores();
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const setActiveStoreId = useActiveStoreStore(
    (state) => state.setActiveStoreId,
  );

  useNotificationsSocket(true);
  useConversationSocket(activeStoreId, null);

  useEffect(() => {
    if (!isLoading && stores.length > 0) {
      const hasActive = stores.some((s) => s.id === activeStoreId);
      if (!activeStoreId || !hasActive) {
        setActiveStoreId(stores[0].id);
      }
    } else if (!isLoading && stores.length === 0) {
      setActiveStoreId(null);
    }
  }, [stores, isLoading, activeStoreId, setActiveStoreId]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <motion.main
          key={topSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 md:px-8 lg:px-4 py-10"
        >
          {!isLoading && stores.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-xl font-semibold">No store found</h2>
              <p className="text-muted-foreground">
                Create a store using the store switcher.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </motion.main>
      </div>
    </div>
  );
}
