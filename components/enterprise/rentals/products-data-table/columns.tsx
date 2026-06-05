"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ApiRentalProduct,  } from "./schema";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  IconCurrencyDollar,
  IconMapPin,
  IconPackage,
} from "@tabler/icons-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTableRowActions } from "./components/data-table-row-actions";

export const columns: ColumnDef<ApiRentalProduct>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-col gap-2 max-w-[300px]">
          <div className="flex items-center gap-2">
            <IconPackage className="size-4 text-orange-500" />
            <span className="font-semibold text-foreground">
              {product.name}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMapPin className="size-3" />
            <span>{product.location}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="type" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400"
        >
          {row.getValue("type")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "condition",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Condition" />
  //   ),
  //   cell: ({ row }) => {
  //     const condition = row.getValue("condition") as string;
  //     const conditionConfig = {
  //       excellent: {
  //         label: "Excellent",
  //         className:
  //           "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
  //       },
  //       good: {
  //         label: "Good",
  //         className:
  //           "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
  //       },
  //       fair: {
  //         label: "Fair",
  //         className:
  //           "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  //       },
  //     };

  //     const config = conditionConfig[condition as keyof typeof conditionConfig];

  //     return (
  //       <Badge variant="outline" className={config.className}>
  //         {config.label}
  //       </Badge>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "price_per_day",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Daily Rate" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price_per_day") as number;
      return (
        <div className="flex items-center gap-1 font-medium">
          <IconCurrencyDollar className="size-4 text-muted-foreground" />
          <span>{price}/day</span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
    cell: ({ row }) => {
      const available = row.getValue("is_active") as boolean;
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={available}
            onCheckedChange={(checked) => {
              console.log("Toggle availability:", checked);
              // Handle availability toggle
            }}
            className="data-[state=checked]:bg-orange-500"
          />
          <span className="text-sm text-muted-foreground">
            {available ? "Yes" : "No"}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "pendingRequests",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Requests" />
  //   ),
  //   cell: ({ row }) => {
  //     const count = row.getValue("pendingRequests") as number;
  //     return (
  //       <div className="flex items-center justify-center">
  //         {count > 0 ? (
  //           <Badge
  //             variant="secondary"
  //             className="bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400"
  //           >
  //             {count} pending
  //           </Badge>
  //         ) : (
  //           <span className="text-sm text-muted-foreground">None</span>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "totalRentals",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Total Rentals" />
  //   ),
  //   cell: ({ row }) => {
  //     const count = row.getValue("totalRentals") as number;
  //     return <div className="text-center font-medium">{count}</div>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
