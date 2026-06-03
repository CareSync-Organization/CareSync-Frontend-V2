import { useForm } from "@tanstack/react-form";
import { FaShopify } from "react-icons/fa";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFieldError } from "@/lib/get-field-error";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useInitiateShopifyConnect } from "../../api/connectors.queries";
import { shopDomainSchema } from "../../schemas/shopify-connector.schema";
import { toast } from "sonner";

type ShopifyConnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShopifyConnectDialog({
  open,
  onOpenChange,
}: ShopifyConnectDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const connectMutation = useInitiateShopifyConnect();

  const form = useForm({
    defaultValues: {
      shopDomain: "",
    },
    onSubmit: ({ value }) => {
      if (!activeStoreId) return;
      const result = shopDomainSchema.safeParse(value.shopDomain);
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? "Invalid store domain.");
        return;
      }
      connectMutation.mutate({
        shopDomain: result.data,
        storeId: activeStoreId,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Shopify</DialogTitle>
          <DialogDescription>
            Enter your Shopify store domain to authorize CareSync access.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 py-4">
          <div className="grid size-32 place-items-center rounded-full bg-emerald-500/10 text-shopify">
            <FaShopify className="size-20" />
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="shopDomain"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Store domain is required";
                return undefined;
              },
            }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Store domain"
                placeholder="mystore.myshopify.com"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <p className="text-xs text-muted-foreground">
            You can enter just your store name (e.g. "mystore") and we'll fill
            in .myshopify.com automatically.
          </p>

          <ActionButton
            type="submit"
            fullWidth
            isLoading={connectMutation.isPending}
            loadingText="Redirecting to Shopify..."
          >
            Connect with Shopify
          </ActionButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
