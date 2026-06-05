"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconPackage } from "@tabler/icons-react";
import productsData from "@/components/enterprise/rentals/products-data-table/data.json";
import requestsData from "@/components/enterprise/rentals/rental-requests-data.json";
import {
  RentalProduct,
  RentalRequest,
} from "@/components/enterprise/rentals/products-data-table/schema";
import { RequestCard } from "@/components/enterprise/rentals/request-card";
import { useState } from "react";

const products = productsData as RentalProduct[];
const allRequests = requestsData as RentalRequest[];

export default function ProductRequestsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = products.find((p) => p.id === productId);
  const [requests, setRequests] = useState(
    allRequests.filter((r) => r.productId === productId)
  );

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: "approved" as const } : r
      )
    );
    console.log("Approved request:", requestId);
  };

  const handleReject = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" as const } : r
      )
    );
    console.log("Rejected request:", requestId);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const otherRequests = requests.filter(
    (r) => r.status !== "pending" && r.status !== "approved"
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="w-fit hover:bg-orange-500/10"
      >
        <IconArrowLeft className="mr-2 size-4" />
        Back to My Products
      </Button>

      {/* Product Header */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <IconPackage className="size-8 text-orange-500" />
                <h1 className="text-3xl font-bold tracking-tight">
                  {product.name}
                </h1>
              </div>
              <p className="text-base text-muted-foreground mb-4">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400"
                >
                  {product.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    product.available
                      ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400"
                  }
                >
                  {product.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-2 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {pendingRequests.length} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {approvedRequests.length} Approved
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {requests.length} Total Requests
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Sections */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {approvedRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            Approved Requests ({approvedRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {otherRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Other Requests ({otherRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconPackage className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No rental requests yet
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            When people request to rent this product, they&apos;ll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
