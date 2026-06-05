"use client";

import { Row } from "@tanstack/react-table";
import { ApiRentalProduct, RentalProduct } from "../schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditProductDialog } from "../../edit-product-dialog";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

interface DataTableRowActionsProps {
  row: Row<ApiRentalProduct>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  const product = row.original;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // const handleViewRequests = () => {
  //   router.push(
  //     `/enterprise/dashboard/rentals/products/${product.id}/requests`
  //   );
  // };
 const deleteProduct = async (product: ApiRentalProduct) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the product permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(`/booking/items/${product.id}`);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Product Deleted",
          text: "The product has been deleted successfully.",
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
            className="flex size-8 p-0 data-[state=open]:bg-muted"
            size="icon"
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* <DropdownMenuItem onClick={handleViewRequests}>
            <IconEye className="mr-2 size-4" />
            View Requests ({product.pendingRequests})
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <IconEdit className="mr-2 size-4" />
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={()=>deleteProduct(product)}>
            <IconTrash className="mr-2 size-4" />
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductDialog
        product={product}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
