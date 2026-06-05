"use client";
import {
  JobsDataTable,
  type Job,
} from "@/components/enterprise/jobs/jobs-data-table";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const MyJobsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["community-jobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/community/jobs?filter=mine");
      return res.data;
    },
  });

  let jobs: Job[] = [];
  if (data && Array.isArray(data.results)) {
    jobs = data.results;
  }

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
              Job Management
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Jobs
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your job postings and view applicant details. Track upcoming,
            ongoing, and concluded job positions all in one place.
          </p>

          {/* Stats Cards */}
          {/* <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {jobs.filter((j) => j.status === "upcoming").length} Upcoming
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {jobs.filter((j) => j.status === "ongoing").length} Ongoing
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <div className="h-2 w-2 rounded-full bg-pink-500"></div>
              <span className="text-sm font-medium text-pink-700 dark:text-pink-400">
                {jobs.filter((j) => j.status === "concluded").length} Concluded
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
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
            Loading jobs...
          </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-lg text-red-500">Failed to load jobs.</span>
        </div>
      ) : (
        <JobsDataTable data={jobs} />
      )}
    </div>
  );
};

export default MyJobsPage;
