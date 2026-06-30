import { useState } from "react";

import { ActionButton } from "@/components/shared/ActionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useInitiateDarazConnect } from "../../api/connectors.queries";
import type { DarazRegion } from "../../types/connectors.types";

const DARAZ_REGIONS: Array<{ value: DarazRegion; label: string }> = [
  { value: "pk", label: "Pakistan" },
  { value: "bd", label: "Bangladesh" },
  { value: "lk", label: "Sri Lanka" },
  { value: "np", label: "Nepal" },
  { value: "mm", label: "Myanmar" },
];

type DarazConnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DarazConnectDialog({
  open,
  onOpenChange,
}: DarazConnectDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const connectMutation = useInitiateDarazConnect();
  const [region, setRegion] = useState<DarazRegion>("pk");

  function handleConnect() {
    if (!activeStoreId) return;
    connectMutation.mutate({ storeId: activeStoreId, region });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Daraz</DialogTitle>
          <DialogDescription>
            Choose the marketplace where your seller account is registered.
            You’ll sign in to Daraz and approve CareSync on the next page.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 py-4">
          <div className="grid size-32 place-items-center rounded-full bg-emerald-500/10">
            <img
              src="/Connectors/Daraz.png"
              alt="Daraz"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="daraz-region">
            Seller marketplace
          </label>
          <Select
            value={region}
            onValueChange={(value) => setRegion(value as DarazRegion)}
            disabled={connectMutation.isPending}
          >
            <SelectTrigger id="daraz-region" className="h-11 w-full">
              <SelectValue placeholder="Choose a marketplace" />
            </SelectTrigger>
            <SelectContent>
              {DARAZ_REGIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This must match the country of the Daraz Seller Center account you
            authorize.
          </p>
        </div>

        <ActionButton
          type="button"
          fullWidth
          isLoading={connectMutation.isPending}
          loadingText="Opening Daraz…"
          disabled={!activeStoreId}
          onClick={handleConnect}
        >
          Continue to Daraz
        </ActionButton>
      </DialogContent>
    </Dialog>
  );
}
