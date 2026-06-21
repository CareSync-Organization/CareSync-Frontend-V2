import { useState } from "react";
import { Store, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStores, useCreateStore } from "../api/stores.queries";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { StoreList } from "./StoreList";
import { CreateStoreDialog } from "./CreateStoreDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function StoreSwitcher() {
  const { data: stores = [], isLoading } = useStores();
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const createStoreMutation = useCreateStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const activeStore = stores.find((store) => store.id === activeStoreId);

  if (isLoading) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-11 gap-3 rounded-xl border-border bg-background px-3 cursor-wait"
        disabled
      >
        <Store className="size-8 text-primary/50 animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading stores...</span>
      </Button>
    );
  }

  // Case 1: No stores
  if (stores.length === 0) {
    return (
      <>
        <Button
          type="button"
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-11 gap-2 rounded-xl bg-primary text-primary-foreground font-semibold px-4 shadow-sm hover:opacity-90"
        >
          Create Your First Store
        </Button>
        <CreateStoreDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          isPending={createStoreMutation.isPending}
          onSubmit={async (name) => {
            await createStoreMutation.mutateAsync(name);
            setIsCreateDialogOpen(false);
          }}
        />
      </>
    );
  }

  // Case 2: Stores exist
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-3 rounded-xl border-border bg-background px-3 hover:bg-muted"
          >
            <Store className="size-8 text-primary" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-none">
                {activeStore?.name ?? "Select Store"}
              </p>
              <Badge className="mt-1 bg-primary text-primary-foreground text-[10px] py-0 px-1">
                Active Store
              </Badge>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <StoreList
            stores={stores}
            activeStoreId={activeStoreId}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateStoreDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        isPending={createStoreMutation.isPending}
        onSubmit={async (name) => {
          await createStoreMutation.mutateAsync(name);
          setIsCreateDialogOpen(false);
        }}
      />
    </>
  );
}

