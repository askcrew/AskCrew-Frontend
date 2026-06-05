"use client";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCheck,
  IconLayoutColumns,
  IconMapPin,
  IconMail,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { GraduationCap, Briefcase } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const applicantSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  specification: z.string(),
  profile: z.enum(["student", "enterprise"]),
  email: z.string().email(),
  skills: z.array(z.string()),
  location: z.string(),
  education: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

export type Applicant = z.infer<typeof applicantSchema>;

// Profile Details Dialog Component
function ProfileDetailsDialog({ applicant }: { applicant: Applicant }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950"
        >
          <IconUser className="mr-2 size-4" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Applicant Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the applicant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="size-20 border-2 border-orange-500/20">
              <AvatarImage src={applicant.image} alt={applicant.name} />
              <AvatarFallback className="bg-orange-500/10 text-orange-700 text-xl font-bold">
                {applicant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{applicant.name}</h3>
              <p className="text-muted-foreground">{applicant.specification}</p>
              <Badge
                variant={
                  applicant.profile === "student" ? "default" : "secondary"
                }
                className="mt-2"
              >
                {applicant.profile === "student" ? (
                  <GraduationCap className="mr-1 size-3" />
                ) : (
                  <Briefcase className="mr-1 size-3" />
                )}
                {applicant.profile}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Contact Information
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <IconMail className="size-4" />
              <span className="text-sm">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <IconMapPin className="size-4" />
              <span className="text-sm">{applicant.location}</span>
            </div>
          </div>

          {/* Education */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Education
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <GraduationCap className="size-4" />
              <span className="text-sm">{applicant.education}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-orange-500/5 border-orange-500/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Action Buttons Component
function ApplicantActions({
  applicant,
  onAccept,
  onReject,
}: {
  applicant: Applicant;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (applicant.status === "accepted") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
          <IconCheck className="mr-1 size-3" />
          Accepted
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReject(applicant.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <IconX className="mr-1 size-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (applicant.status === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
          <IconX className="mr-1 size-3" />
          Rejected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAccept(applicant.id)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
        >
          <IconCheck className="mr-1 size-4" />
          Accept
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAccept(applicant.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 border-green-500/20"
            >
              <IconCheck className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Accept Applicant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(applicant.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-500/20"
            >
              <IconX className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject Applicant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function ApplicantsDataTable({
  data: initialData,
}: {
  data: Applicant[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleAccept = React.useCallback((id: string) => {
    setData((prev) =>
      prev.map((applicant) =>
        applicant.id === id
          ? { ...applicant, status: "accepted" as const }
          : applicant
      )
    );
  }, []);

  const handleReject = React.useCallback((id: string) => {
    setData((prev) =>
      prev.map((applicant) =>
        applicant.id === id
          ? { ...applicant, status: "rejected" as const }
          : applicant
      )
    );
  }, []);

  const columns: ColumnDef<Applicant>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
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
        header: "Applicant",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border-2 border-orange-500/20">
              <AvatarImage src={row.original.image} alt={row.original.name} />
              <AvatarFallback className="bg-orange-500/10 text-orange-700 font-bold">
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.email}
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
          <div className="font-medium">{row.original.specification}</div>
        ),
      },
      {
        accessorKey: "profile",
        header: "Profile Type",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.profile === "student" ? "default" : "secondary"
            }
            className="capitalize"
          >
            {row.original.profile === "student" ? (
              <GraduationCap className="mr-1 size-3" />
            ) : (
              <Briefcase className="mr-1 size-3" />
            )}
            {row.original.profile}
          </Badge>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <div className="text-muted-foreground flex items-center gap-2">
            <IconMapPin className="size-4" />
            {row.original.location}
          </div>
        ),
      },
      {
        accessorKey: "education",
        header: "Education",
        cell: ({ row }) => (
          <div className="text-muted-foreground max-w-[200px] truncate">
            {row.original.education}
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
              {status}
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
    ],
    [handleAccept, handleReject]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search applicants..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("profile")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("profile")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Filter profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="mr-2 size-4" />
                Columns
                <IconChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table className="border-orange-500">
          <TableHeader className="bg-orange-500/10 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
