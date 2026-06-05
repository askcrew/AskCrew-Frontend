"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Job } from "./schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Job>[] = [
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
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.job_title}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => <div>{row.original.company_name}</div>,
  },
  {
    accessorKey: "about",
    header: "About",
    cell: ({ row }) => (
      <div
        className="text-muted-foreground max-w-50 truncate"
        title={row.original.about}
      >
        {row.original.about}
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) =>
      row.original.is_active ? (
        <Badge variant="outline" className="text-green-600 border-green-400">
          Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-400">
          Inactive
        </Badge>
      ),
  },
  {
    accessorKey: "applications_count",
    header: "Applicants",
    cell: ({ row }) => (
      <div className="text-center">{row.original.applications_count}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <div>{new Date(row.original.created_at).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell id={row.original.id.toString()} />,
  },
];

// Actions cell component to use hooks properly
function ActionsCell({ id }: { id: string }) {
  const deleteJob = useDeleteWorkshop();

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
          <Link href={`/enterprise/dashboard/jobs/my-jobs/${id}/applicants`}>
            Show Applicants
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit Job</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteJob.mutate(id)}
          variant="destructive"
        >
          Delete Job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// Custom hook to handle workshop deletion
export function useDeleteWorkshop() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/community/jobs/${id}/`);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Job has been deleted successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["jobs-mine"] });
        router.push("/enterprise/dashboard/jobs/my-jobs");
      }
    },
    onError: (error: unknown) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: (error as any)?.response?.data?.detail || "Failed to delete job.",
      });
    },
  });
}
