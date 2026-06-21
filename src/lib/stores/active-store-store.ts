import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveStoreStore = {
  activeStoreId: string | null;
  setActiveStoreId: (activeStoreId: string | null) => void;
};

export const useActiveStoreStore = create<ActiveStoreStore>()(
  persist(
    (set) => ({
      activeStoreId: null,
      setActiveStoreId: (activeStoreId) => set({ activeStoreId }),
    }),
    {
      name: "caresync-active-store",
    },
  ),
);