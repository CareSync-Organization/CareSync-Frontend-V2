import { Check, ChevronDown, Store } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const demoStores = [
  { id: "main", name: "Clothing Store", plan: "Professional" },
  { id: "secondary", name: "Shoe Store", plan: "Starter" },
  { id: "third", name: "Book Store", plan: "Professional" },
];

export function StoreSwitcher() {
  const [activeStoreId, setActiveStoreId] = useState("main");

  const activeStore =
    demoStores.find((store) => store.id === activeStoreId) ?? demoStores[0];

  return (
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
              {activeStore.name}
            </p>
            <Badge className="mt-1 bg-primary text-primary-foreground">
              {activeStore.plan}
            </Badge>
          </div>

          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch store</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {demoStores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setActiveStoreId(store.id)}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">{store.name}</p>
              <p className="text-xs text-muted-foreground">{store.plan}</p>
            </div>

            {store.id === activeStoreId ? (
              <Check className="size-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
