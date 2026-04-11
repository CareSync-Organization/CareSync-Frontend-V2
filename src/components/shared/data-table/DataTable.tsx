import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { SearchX } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Table as TanStackTable } from "@tanstack/react-table";

import { DataTablePagination } from "./DataTablePagination";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  toolbar?: (table: TanStackTable<TData>) => React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  initialPageSize?: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  toolbar,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  globalFilter,
  onGlobalFilterChange,
  pagination,
  onPaginationChange,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalPagination, setInternalPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPageSize,
    });

  const resolvedSorting = sorting ?? internalSorting;
  const resolvedColumnFilters = columnFilters ?? internalColumnFilters;
  const resolvedGlobalFilter = globalFilter ?? internalGlobalFilter;
  const resolvedPagination = pagination ?? internalPagination;

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting: resolvedSorting,
      columnFilters: resolvedColumnFilters,
      globalFilter: resolvedGlobalFilter,
      pagination: resolvedPagination,
    },
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange:
      onColumnFiltersChange ?? setInternalColumnFilters,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    manualPagination,
    manualSorting,
    manualFiltering,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {toolbar ? <div>{toolbar(table)}</div> : null}

      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={
                      onRowClick
                        ? "cursor-pointer transition hover:bg-muted/50"
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <SearchX className="size-8 opacity-40" />
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs opacity-70">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
