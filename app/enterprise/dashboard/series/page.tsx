"use client";

import { useState, useMemo } from "react";
import { SeriesCard } from "@/components/enterprise/series/series-card";
import { SeriesFilter } from "@/components/enterprise/series/series-filter";
import { AddSeriesDialog } from "@/components/enterprise/series/add-series-dialog";
import { IconBrandCinema4d } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { ISeries } from "@/components/enterprise/series/schema";
import CustomSelect from "@/components/global/custom-select";

const SeriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Fetch categories using tanstack query
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/categories");
      return res.data.categories;
    },
  });

  // Transform categories for CustomSelect
  const categoryOptions = categoriesData
    ? [
        { label: "All Categories", value: "all" },
        ...categoriesData.map((cat: { id: number; name: string }) => ({
          label: cat.name,
          value: cat.name,
        })),
      ]
    : [{ label: "All Categories", value: "all" }];

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/content/series");
      return res.data;
    },
  });
  const filteredSeries = useMemo(() => {
    return (
      data &&
      data?.results?.filter((series: ISeries) => {
        const matchesSearch = series.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          series.category.name === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    );
  }, [data, searchQuery, selectedCategory]);
  console.log("data", data);

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
              Content Library
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IconBrandCinema4d className="size-10 text-orange-500" />
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Series
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your series collection. Upload new series, organize by
            category, and track viewer engagement.
          </p>

          {/* Stats Cards */}
          {/* <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {stats.total} Series
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <IconBrandCinema4d className="size-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {stats.totalEpisodes} Episodes
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {stats.totalViews.toLocaleString()} Views
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {stats.avgRating} Avg Rating
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          {/* <SeriesFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategory !== "all" ? [selectedCategory] : []}
            onCategoriesChange={setSelectedCategory}
            categories={categoryOptions}
          /> */}

          <CustomSelect
            options={categoryOptions}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            placeholder={isCategoriesLoading ? "Loading..." : "Select category"}
            containerClassName="w-full md:w-48 space-y-0"
            className="h-10"
            message={categoriesError ? "Failed to load categories" : undefined}
          />
        </div>
        <AddSeriesDialog />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredSeries?.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {data?.results?.length}
          </span>{" "}
          series
        </p>
      </div>

      {/* Series Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center items-center py-12">
            <svg
              className="animate-spin h-6 w-6 text-muted-foreground mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading Series...
          </div>
        )}
        {filteredSeries?.map((series: ISeries) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
      {filteredSeries?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconBrandCinema4d className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No series found
          </h3>
        </div>
      )}
    </div>
  );
};

export default SeriesPage;
