import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, RotateCcw, Trash2 } from "lucide-react";

import { SearchInput } from "@/components/shared/SearchInput";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { ActionButton } from "@/components/shared/ActionButton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { statusConfig } from "../config/user-permissions.config";
import type { TeamMember, UserStatus } from "../types/users.types";

type UsersTableProps = {
  members: TeamMember[];
  isLoading?: boolean;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
};

export function UsersTable({
  members,
  isLoading: _isLoading,
  onEditMember,
  onDeleteMember,
}: UsersTableProps) {
  const [pendingDelete, setPendingDelete] = useState<TeamMember | null>(null);

  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        filterFn: (row, _columnId, filterValue) => {
          const query = String(filterValue ?? "").trim().toLowerCase();
          if (!query) return true;
          return `${row.original.name} ${row.original.email}`
            .toLowerCase()
            .includes(query);
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <UserAvatar name={row.original.name} />
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        filterFn: "equalsString",
        cell: ({ row }) =>
          row.original.role === "admin" ? (
            <Badge className="bg-violet-500/10 text-violet-600">Admin</Badge>
          ) : (
            <Badge className="bg-primary/10 text-primary">Agent</Badge>
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: "equalsString",
        cell: ({ row }) => (
          <Badge className={statusConfig[row.original.status as UserStatus].className}>
            {statusConfig[row.original.status as UserStatus].label}
          </Badge>
        ),
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
        cell: ({ row }) => row.original.lastActive ?? "Never",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => onEditMember(row.original)}
            >
              <Edit2 className="size-4" />
            </button>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-lg text-destructive transition hover:bg-destructive/10"
              aria-label={`Remove ${row.original.name}`}
              onClick={() => setPendingDelete(row.original)}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [onEditMember],
  );

  return (
    <>
      <div className="rounded-xl border-2 bg-card shadow-sm">
        <div className="border-b px-4 py-4">
          <h2 className="text-base font-semibold">Team Members</h2>
        </div>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={members}
            toolbar={(table) => {
              const nameColumn = table.getColumn("name");
              const roleColumn = table.getColumn("role");
              const statusColumn = table.getColumn("status");
              const hasFilters =
                Boolean(nameColumn?.getFilterValue()) ||
                Boolean(roleColumn?.getFilterValue()) ||
                Boolean(statusColumn?.getFilterValue());

              return (
                <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_160px_160px_auto] md:items-center">
                  <SearchInput
                    placeholder="Search by name or email..."
                    value={(nameColumn?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                      nameColumn?.setFilterValue(event.target.value)
                    }
                  />
                  <Select
                    value={(roleColumn?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                      roleColumn?.setFilterValue(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={(statusColumn?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                      statusColumn?.setFilterValue(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <ActionButton
                    type="button"
                    variant="outline"
                    startIcon={<RotateCcw className="size-4" />}
                    disabled={!hasFilters}
                    onClick={() => table.resetColumnFilters()}
                  >
                    Reset
                  </ActionButton>
                </div>
              );
            }}
          />
        </div>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {pendingDelete?.name}
              </span>{" "}
              ({pendingDelete?.email}) from your store. They will lose all access
              immediately. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) {
                  onDeleteMember(pendingDelete.id);
                  setPendingDelete(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
