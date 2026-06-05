"use client";

import {
  IconCheck,
  IconMapPin,
  IconX,
  IconBriefcase as IconExperience,
} from "@tabler/icons-react";
import { GraduationCap, Briefcase } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { JobApplicant } from "./schema";
import { ProfileDetailsDialog } from "./components/profile-details-dialog";
import { ApplicantActions } from "./components/applicant-actions";

export const createColumns = (
  handleAccept: (id: string) => void,
  handleReject: (id: string) => void
): ColumnDef<JobApplicant>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          variant={"orange"}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
    header: "Applicant",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border-2 border-orange-500/20">
          {/* <AvatarImage src={row.original.image} alt={row.original.name} /> */}
          <AvatarFallback className="bg-orange-500/10 text-orange-700 font-bold">
            {(row.original.name as string)
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.name as string}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.email as string}
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "specification",
    header: "Specification",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.specification as string}</div>
    ),
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => (
      <Badge variant="outline">
        <IconExperience className="mr-1 size-3" />
        {row.original.experience as string}
      </Badge>
    ),
  },
  {
    accessorKey: "profile",
    header: "Profile Type",
    cell: ({ row }) => (
      <Badge
        variant={row.original.profile === "student" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.profile === "student" ? (
          <GraduationCap className="mr-1 size-3" />
        ) : (
          <Briefcase className="mr-1 size-3" />
        )}
        {row.original.profile as string}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center gap-2">
        <IconMapPin className="size-4" />
        {row.original.location as string}
      </div>
    ),
  },
  {
    accessorKey: "education",
    header: "Education",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-50 truncate">
        {row.original.education as string}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let className = "";

      if (status === "accepted") {
        className =
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      } else if (status === "rejected") {
        className =
          "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      } else {
        className =
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      }

      return (
        <Badge className={className + " capitalize"}>
          {status === "accepted" && <IconCheck className="mr-1 size-3" />}
          {status === "rejected" && <IconX className="mr-1 size-3" />}
          {status as string}
        </Badge>
      );
    },
  },
  {
    id: "profile-action",
    header: "Profile",
    cell: ({ row }) => <ProfileDetailsDialog applicant={row.original} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ApplicantActions
        applicant={row.original}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    ),
  },
];
