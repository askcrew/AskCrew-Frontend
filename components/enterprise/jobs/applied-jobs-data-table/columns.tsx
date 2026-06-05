"use client";

import * as React from "react";
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconLoader,
  IconMapPin,
  IconCurrencyDollar,
  IconStar,
  IconBuilding,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
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
import type { ApplicantJob } from "./schema";
import { ReviewJobDialog } from "./components/review-job-dialog";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

// Actions Cell Component
function ActionsCell({ job }: { job: ApplicantJob }) {
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const isConcluded = job.status === "accepted";
 const deleteApplication = async (job: ApplicantJob) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the application permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(`/community/applications/${job.id}`);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Application Deleted",
          text: "The application has been deleted successfully.",
        });
        window.location.reload();
      }
    } catch (e: unknown) {
      const error = e as AxiosError<{ message: string }>;
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred while submitting the form.",
      });
    } 
  };
  return (
    <>
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
          <DropdownMenuItem>View Details</DropdownMenuItem>
          {isConcluded && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setReviewDialogOpen(true)}
                className="text-orange-600 dark:text-orange-400"
              >
                <IconStar className="mr-2 size-4" />
                Review Position
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={()=>deleteApplication(job)}>
            Withdraw Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isConcluded && (
        <ReviewJobDialog
          job={job}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
        />
      )}
    </>
  );
}

export const columns: ColumnDef<ApplicantJob>[] = [
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
    accessorKey: "title",
    header: "Job Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.job_title}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconBuilding className="size-4 text-muted-foreground" />
        <span>{row.original.job_company}</span>
      </div>
    ),
  },
  // {
  //   accessorKey: "is_seen",
  //   header: "Handled",
  //   cell: ({ row }) => (
  //     <div className="text-muted-foreground flex items-center gap-2">
  //       {row.original.is_seen ? (
  //         <>
  //           <IconCircleCheckFilled className="size-4 text-green-500" />
  //           <span>Handled</span>
  //         </>
  //       ) : (
  //         <>
  //           <IconLoader className="size-4" />
  //           <span>Pending</span>
  //         </>
  //       )}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "salary",
  //   header: "Salary",
  //   cell: ({ row }) => (
  //     <div className="text-muted-foreground flex items-center gap-2">
  //       <IconCurrencyDollar className="size-4" />
  //       {row.original.salary}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "type",
  //   header: "Type",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="capitalize">
  //       {row.original.status}
  //     </Badge>
  //   ),
  // },
  // {
  //   accessorKey: "startDate",
  //   header: "Start Date",
  //   cell: ({ row }) => (
  //     <div className="text-muted-foreground flex items-center gap-2">
  //       <IconCalendar className="size-4" />
  //       {row.original.startDate}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "endDate",
  //   header: "End Date",
  //   cell: ({ row }) => (
  //     <div className="text-muted-foreground flex items-center gap-2">
  //       <IconCalendar className="size-4" />
  //       {row.original.endDate}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";
      let icon = <IconLoader className="size-5" />;

      if (status === "accepted") {
        variant = "secondary";
        icon = <IconCircleCheckFilled className="size-5 text-green-500" />;
      } else if (status === "pending") {
        variant = "secondary";
        icon = <IconClock className="size-5" />;
      } else if (status === "rejected") {
        variant = "outline";
        icon = <IconCalendar className="size-5" />;
      }

      return (
        <Badge
          variant={variant}
          className="gap-1 capitalize py-2 px-3 w-[150px]"
        >
          {icon}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell job={row.original} />,
  },
];
