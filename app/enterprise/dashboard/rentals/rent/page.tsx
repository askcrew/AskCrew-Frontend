"use client";

import { useState, useMemo } from "react";
import { RentProductCard } from "@/components/enterprise/rentals/rent-product-card";
import productsData from "@/components/enterprise/rentals/products-data-table/data.json";
import {
  ApiRentalProduct,
  RentalProduct,
} from "@/components/enterprise/rentals/products-data-table/schema";
import {
  IconPackage,
  IconSparkles,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

const RentProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rentals-suggested-products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/booking/items?suggested=true");
      return res.data;
    },
  });
  console.log("data", data);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data?.results?.map((p: ApiRentalProduct) => p.type))
    ) as string[];
    return uniqueCategories.sort();
  }, [data]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return data?.results?.filter((product: ApiRentalProduct) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.type);

      // Availability filter
      const matchesAvailability = !showAvailableOnly || product.is_active;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [searchQuery, selectedCategories, showAvailableOnly, data?.results]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

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
              Rent Products
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse and rent equipment from other users. Find the perfect gear
            for your next project.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {data?.results?.length} Products Available
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {data?.results?.filter((p: ApiRentalProduct) => p.is_active).length} Currently
                Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-2 focus-visible:border-orange-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 border-2">
                  <IconFilter className="mr-2 size-4" />
                  Category
                  {selectedCategories.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 rounded-sm px-1 font-normal bg-orange-500/20"
                    >
                      {selectedCategories.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability Toggle */}
            <Button
              variant={showAvailableOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`h-10 ${
                showAvailableOnly
                  ? "bg-green-500 hover:bg-green-600"
                  : "border-2"
              }`}
            >
              {showAvailableOnly ? "Available Only" : "Show All"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredProducts?.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {data?.results?.length}
          </span>{" "}
          products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: ApiRentalProduct) => (
            <RentProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconPackage className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Try adjusting your filters or search query to find more products.
          </p>
        </div>
      )}
    </div>
  );
};

export default RentProductsPage;
