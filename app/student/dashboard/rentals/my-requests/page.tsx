"use client";

import { useState, useMemo } from "react";
import { MyRequestCard } from "@/components/enterprise/rentals/my-request-card";
import requestsData from "@/components/enterprise/rentals/rental-requests-data.json";
import {
  RentalRequest,
  ApiRentalRequest,
} from "@/components/enterprise/rentals/products-data-table/schema";
import { IconPackage, IconSparkles } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

const allRequests = requestsData as RentalRequest[];

const MyRequestsPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["rentals-my-requests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/booking/bookings/?mine=true");
      return res.data;
    },
  });
  console.log("data", data);

  // Filter requests by status
  const requestsByStatus = useMemo(() => {
    return {
      all: data?.results || [],
      pending:
        data?.results.filter((r: ApiRentalRequest) => r.status === "pending") ||
        [],
      approved:
        data?.results.filter(
          (r: ApiRentalRequest) => r.status === "approved"
        ) || [],
      rejected:
        data?.results.filter(
          (r: ApiRentalRequest) => r.status === "rejected"
        ) || [],
      completed:
        data?.results.filter(
          (r: ApiRentalRequest) => r.status === "completed"
        ) || [],
    };
  }, [data?.results]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Rentals
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IconPackage className="size-10 text-orange-500" />
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Requests
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your rental requests and communicate with product owners.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {data?.results?.length} Total Requests
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {requestsByStatus?.pending?.length} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {requestsByStatus?.approved?.length} Approved
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {requestsByStatus?.completed?.length} Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50 border-2 border-orange-500/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            All ({requestsByStatus?.all?.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Pending ({requestsByStatus?.pending?.length})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Approved ({requestsByStatus?.approved?.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Rejected ({requestsByStatus?.rejected?.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Completed ({requestsByStatus.completed.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(requestsByStatus).map(([status, requests]) => (
          <TabsContent key={status} value={status} className="mt-6">
            {requests?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request: ApiRentalRequest) => (
                  <MyRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
                <IconPackage className="size-20 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No {status} requests
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {status === "all"
                    ? "You haven't made any rental requests yet."
                    : `You don't have any ${status} requests at the moment.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MyRequestsPage;
