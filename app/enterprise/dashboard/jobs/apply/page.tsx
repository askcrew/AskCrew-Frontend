"use client";

import { useState } from "react";
import { AppliedJob } from "@/components/enterprise/jobs/applied-jobs-data-table";
import { JobCard } from "@/components/enterprise/jobs/job-card";
import { JobDetailsDialog } from "@/components/enterprise/jobs/job-details-dialog";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

// Mock data for available jobs

const ApplyToJobsPage = () => {
  const [selectedJob, setSelectedJob] = useState<AppliedJob | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/community/jobs?filter=suggested");
      return res.data;
    },
  });

  console.log("data", data);

  const handleApply = async (job: AppliedJob) => {
    const id = job.id;
    try {
      const response = await axiosInstance.post(`community/applications/`, {
        job: id,
      });
      console.log("res", response);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data?.message || "Application successful!",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "An unexpected error occurred.",
      });
      console.error("Application error:", error);
    }
  };

  const handleViewDetails = (job: AppliedJob) => {
    setSelectedJob(job);
    setDetailsOpen(true);
  };

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
              Job Opportunities
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Apply to Jobs
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse and apply to exciting job opportunities in the film and
            entertainment industry. Find your next role and advance your career.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data &&
          data?.results?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              onViewDetails={handleViewDetails}
            />
          ))}
      </div>

      <JobDetailsDialog
        job={selectedJob}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApply={handleApply}
      />
    </div>
  );
};

export default ApplyToJobsPage;
