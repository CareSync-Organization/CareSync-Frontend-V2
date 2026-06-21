import { Check, Pencil, Plus } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useState } from "react";
import { DeleteStoreDialog } from "./DeleteStoreDialog";
import type { Store } from "../types/stores.types";
import { UpdateStoreDialog } from "./UpdateStoreDialog";

type StoreListProps = {
  stores: Store[];
  activeStoreId: string | null;
  onCreateClick: () => void;
};

export function StoreList({
  stores,
  activeStoreId,
  onCreateClick,
}: StoreListProps) {
  const setActiveStoreId = useActiveStoreStore((state) => state.setActiveStoreId);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [storeToUpdate, setStoreToUpdate] = useState<Store | null>(null)

  const activeStore = stores.find((store) => store.id === activeStoreId);

  return (
    <>
      <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {stores.map((store) => (
        <DropdownMenuItem
          key={store.id}
          onClick={() => setActiveStoreId(store.id)}
          className="flex items-center justify-between"
        >
          <span className="text-sm font-medium">{store.name}</span>

          <span className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Rename ${store.name}`}
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setStoreToUpdate(store);
              }}
            >
              <Pencil className="size-3.5" />
            </button>

            {store.id === activeStoreId ? (
              <Check className="size-4 text-primary" />
            ) : null}
          </span>
        </DropdownMenuItem>
      ))}

      {activeStore ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setStoreToDelete(activeStore);
            }}
            className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
          >
            Delete Active Store
          </DropdownMenuItem>
        </>
      ) : null}

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={onCreateClick}
        className="flex cursor-pointer items-center gap-2 font-medium text-primary focus:text-primary"
      >
        <Plus className="size-4" />
        <span>Add Another Store</span>
      </DropdownMenuItem>

      <UpdateStoreDialog
        store={storeToUpdate}
        open={storeToUpdate !== null}
        onOpenChange={(open) => {
          if (!open) setStoreToUpdate(null);
        }}
      />

      <DeleteStoreDialog
        store={storeToDelete}
        open={storeToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setStoreToDelete(null);
          }
        }}
      />
    </>
  );
}