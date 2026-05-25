import { cn } from "@/lib/utils";

import type { PermissionConfig } from "../config/user-permissions.config";
import type { PermissionLevel } from "../types/users.types";

type PermissionRowProps = {
  config: PermissionConfig;
  value: PermissionLevel;
  onChange: (value: PermissionLevel) => void;
};

export function PermissionRow({ config, value, onChange }: PermissionRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
      <div className="flex shrink-0 gap-1 rounded-lg border p-1">
        {config.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition",
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
