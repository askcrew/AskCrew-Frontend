"use client";
import {
  ProductsDataTable,

} from "@/components/enterprise/rentals/products-data-table";
import { ApiRentalProduct } from "@/components/enterprise/rentals/products-data-table/schema";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";


const MyProductsPage = () => {

    const { data, isLoading, error } = useQuery({
    queryKey: ["rentals-my-products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/booking/items?mine=true");
      return res.data;
    },
  });
  console.log("data",data);
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Content */}
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Rentals
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your rental products, track requests, and update
            availability. Keep your equipment listings up to date to attract
            more renters.
          </p>

          {/* Stats Cards */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {data?.results?.filter((p:ApiRentalProduct) => p.is_active).length} Available
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {data?.results?.filter((p:ApiRentalProduct) => !p.is_active).length} Unavailable
              </span>
            </div>
            {/* <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {products.reduce((acc, p) => acc + p.pendingRequests, 0)}{" "}
                Pending Requests
              </span>
            </div> */}
            {/* <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {products.reduce((acc, p) => acc + p.totalRentals, 0)} Total
                Rentals
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <ProductsDataTable data={data?.results} />
    </div>
  );
};

export default MyProductsPage;
