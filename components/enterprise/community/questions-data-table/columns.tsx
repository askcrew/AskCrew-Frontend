"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Question } from "./schema";
import { Badge } from "@/components/ui/badge";
import { IconEye, IconMessage } from "@tabler/icons-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTableRowActions } from "./components/data-table-row-actions";

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question" />
    ),
    cell: ({ row }) => {
      const question = row.original;
      return (
        <div className="flex flex-col gap-2 max-w-[500px]">
          <div className="font-semibold text-foreground hover:text-orange-500 transition-colors cursor-pointer">
            {question.title}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {question.description}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {question.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400"
        >
          {row.getValue("category")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        open: {
          label: "Open",
          className:
            "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
        },
        answered: {
          label: "Answered",
          className:
            "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
        },
        closed: {
          label: "Closed",
          className:
            "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400",
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig];

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "answersCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Answers" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("answersCount") as number;
      return (
        <div className="flex items-center gap-2">
          <IconMessage className="size-4 text-muted-foreground" />
          <span className="font-medium">{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "viewsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("viewsCount") as number;
      return (
        <div className="flex items-center gap-2">
          <IconEye className="size-4 text-muted-foreground" />
          <span className="font-medium">{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
