"use client";

import { IconCalendar, IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Workshop } from "./schema";
import { DragHandle } from "./components/drag-handle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export const columns: ColumnDef<Workshop>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          variant={"orange"}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          variant={"orange"}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center gap-2">
        <IconCalendar className="size-4" />
        {row.original.start_date
          ? row.original.start_date.split("T")[0]
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center gap-2">
        <IconCalendar className="size-4" />
        {row.original.end_date ? row.original.end_date.split("T")[0] : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "applicantsCount",
    header: "Applications",
    cell: ({ row }) => (
      <div className="text-center">{row.original.number_of_participants}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="text-muted-foreground max-w-50 truncate"
        title={row.original.description}
      >
        {row.original.description}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];

// Actions cell component to use hooks properly
function ActionsCell({ id }: { id: string }) {
  const deleteWorkshop = useDeleteWorkshop();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={`/enterprise/dashboard/workshops/my-workshop/${id}/applicants`}
          >
            Show Applicants
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit Workshop</DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => deleteWorkshop.mutate(id)}
        >
          Delete Workshop
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Custom hook to handle workshop deletion
export function useDeleteWorkshop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/workshop/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-workshops"] });
    },
  });
}
