"use client";

import { useState } from "react";
import { Workshop } from "@/components/enterprise/workshops/workshops-data-table";
import { WorkshopCard } from "@/components/enterprise/workshops/workshop-card";
import { WorkshopDetailsDialog } from "@/components/enterprise/workshops/workshop-details-dialog";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

// Mock data for other users' workshops


const ApplyToWorkshopsPage = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);


  const { data, isLoading, error } = useQuery({
      queryKey: ["workshop"],
      queryFn: async () => {
        const res = await axiosInstance.get(`/workshop/`);
        return res.data;
      },
    });


  const handleApply = async (workshop: Workshop) => {
    const id= workshop.id;
    try {
       const response = await axiosInstance.post(`workshop/registrations/`,{
        workshop: id,
       });
       console.log("res",response);
       
        if (response.status === 201) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data?.message || "Signup successful!",
              })
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

  const handleViewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Apply to Workshops
        </h1>
        <p className="text-muted-foreground">
          Browse and apply to upcoming workshops hosted by other professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results?.map((workshop: Workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <WorkshopDetailsDialog
        workshop={selectedWorkshop}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApply={handleApply}
      />
    </div>
  );
};

export default ApplyToWorkshopsPage;
