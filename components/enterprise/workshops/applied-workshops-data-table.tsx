"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconStar,
} from "@tabler/icons-react";
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
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { z } from "zod";

import { RatingGroup } from "@/components/global/rating-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import type {
  AppliedWorkshops,
  Workshop,
  WorkshopApplication,
} from "./workshops-data-table/schema";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { WorkshopDetailsDialog } from "./workshop-details-dialog";

export const appliedWorkshopSchema = z.object({
  id: z.string(),
  registration_date: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

export type AppliedWorkshop = z.infer<typeof appliedWorkshopSchema>;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Review Dialog Component
function ReviewWorkshopDialog({
  workshop,
  open,
  onOpenChange,
}: {
  workshop: WorkshopApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");

  const handleSubmit = () => {
    // Handle review submission here
    console.log("Submitting review:", {
      workshopId: workshop.id,
      rating,
      review,
    });
    onOpenChange(false);
    // Reset form
    setRating(0);
    setReview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Review Workshop
          </DialogTitle>
          <DialogDescription>
            Share your experience with the workshop
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Workshop Info */}
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4">
            <h3 className="font-semibold text-lg mb-1">
              Workshop #{workshop.id}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                Registered: {workshop.registration_date}
              </div>
            </div>
          </div>

          {/* Rating */}
          <RatingGroup
            label="Your Rating"
            description="Rate your overall experience with this workshop"
            value={rating}
            onValueChange={setRating}
            ratingClassName="text-yellow-400"
            max={5}
            size="lg"
            required
          />

          {/* Review Text */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none">
              Your Review
              <span className="text-destructive ml-1">*</span>
            </label>
            <Textarea
              placeholder="Share your thoughts about the workshop..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim() === ""}
            className="bg-linear-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns: ColumnDef<WorkshopApplication>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={String(row.original.id)} />,
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
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "registration_date",
    header: "Registration Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center gap-2">
        <IconCalendar className="size-4" />
        {row.original.registration_date}
      </div>
    ),
  },
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
  // {
  //   accessorKey: "applicantsCount",
  //   header: "Applicants",
  //   cell: ({ row }) => (
  //     <div className="text-center">{row.original.applicantsCount}</div>
  //   ),
  // },
  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   cell: ({ row }) => (
  //     <div
  //       className="text-muted-foreground max-w-[200px] truncate"
  //       title={row.original.description}
  //     >
  //       {row.original.description}
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

      if (status === "approved") {
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
        <Badge variant={variant} className="gap-1 capitalize py-2 px-3 w-37.5">
          {icon}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: (props) => <ReviewCell {...props} />,
  },
];

function ReviewCell({ row }: { row: Row<WorkshopApplication> }) {
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const isConcluded = row.original.status === "approved";

  const { data: workshopDetails } = useQuery<Workshop>({
    queryKey: ["workshop", row.original.workshop],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/workshop/${row.original.workshop}/`,
      );
      return res.data;
    },
    enabled: detailsOpen,
  });

  const handleViewDetails = () => {
    setDetailsOpen(true);
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
          <DropdownMenuItem onClick={handleViewDetails}>
            View Details
          </DropdownMenuItem>
          {isConcluded && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setReviewDialogOpen(true)}
                className="text-orange-600 dark:text-orange-400"
              >
                <IconStar className="mr-2 size-4" />
                Review Workshop
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            Withdraw Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkshopDetailsDialog
        workshop={workshopDetails || null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApply={() => {
          Swal.fire({
            title: "Already Applied",
            text: "You have already applied to this workshop.",
            icon: "info",
          });
        }}
      />

      {isConcluded && (
        <ReviewWorkshopDialog
          workshop={row.original}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
        />
      )}
    </>
  );
}

function DraggableRow({ row }: { row: Row<WorkshopApplication> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function AppliedWorkshopsDataTable({
  data,
}: {
  data: AppliedWorkshops;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Ensure all ids are strings for compatibility with the table schema
  const normalizedResults = React.useMemo(
    () =>
      data?.results?.map((item: WorkshopApplication) => ({
        ...item,
        id: String(item.id),
      })) || [],
    [data?.results],
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => normalizedResults.map(({ id }: { id: string }) => id),
    [normalizedResults],
  );

  const table = useReactTable({
    data: data?.results,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => String(row.id),
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

  function handleDragEnd() {
    // const { active, over } = event;
    // if (active && over && active.id !== over.id) {
    //   setData((data) => {
    //     const oldIndex = dataIds.indexOf(active.id);
    //     const newIndex = dataIds.indexOf(over.id);
    //     return arrayMove(data, oldIndex, newIndex);
    //   });
    // }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter workshops..."
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="h-8 w-37.5 lg:w-62.5"
          />
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
                    column.getCanHide(),
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
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
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
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
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
